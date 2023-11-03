import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

const TimeClockAdmin = () => {
    const db = getFirestore();

    const [users, setUsers] = useState([]);
    const [selectedUserID, setSelectedUserID] = useState('');
    const [attendances, setAttendances] = useState([]);
    const [weekOffset, setWeekOffset] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);
    const [editingId, setEditingId] = useState(null);
    const [editingType, setEditingType] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            // Fetch users with roles of either 'admin' or 'employee'
            const q = query(
                collection(db, 'users'),
                where('role', 'in', ['admin', 'employee'])
            );

            const userSnapshot = await getDocs(q);
            const usersData = [];
            const userIdsFromUsers = new Set(); // Keep track of user IDs

            userSnapshot.forEach(doc => {
                usersData.push({
                    uid: doc.id,
                    ...doc.data()
                });
                userIdsFromUsers.add(doc.id);
            });

            // Now fetch attendance of these users
            const attendanceSnapshot = await getDocs(collection(db, 'attendance'));
            const userIdsFromAttendance = new Set();

            attendanceSnapshot.forEach(doc => {
                const userId = doc.data().userID;
                if (userIdsFromUsers.has(userId)) {
                    userIdsFromAttendance.add(userId);
                }
            });

            // Now, filter out users that don't have attendance
            const filteredUsers = usersData.filter(user => userIdsFromAttendance.has(user.uid));

            setUsers(filteredUsers);
        };

        fetchUsers();
    }, [db]);



    useEffect(() => {
        const fetchAttendance = async () => {
            if (!selectedUserID) return;

            const { startDate, endDate } = getWeekRange(weekOffset);

            const q = query(
                collection(db, 'attendance'),
                where('userID', '==', selectedUserID),
                where('date', '>=', startDate),
                where('date', '<=', endDate)
            );

            const querySnapshot = await getDocs(q);
            const weekAttendances = [];
            querySnapshot.forEach(doc => {
                const data = doc.data();
                weekAttendances.push({
                    id: doc.id,
                    ...data
                });
            });
            setAttendances(weekAttendances);
        };

        fetchAttendance();
    }, [db, selectedUserID, weekOffset, refreshKey]);



    // const handleTimeEdit = (attendanceID, type, newTime) => {
    //     // Get the existing date from either the clockInTime or clockOutTime
    //     const existingDate = new Date(attendances.find(a => a.id === attendanceID)[type]);

    //     // Split the entered time to get hours and minutes
    //     const timeParts = newTime.split(':');

    //     // Set only the hours and minutes to the existingDate object
    //     existingDate.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10));

    //     const newIsoTime = existingDate.toISOString();

    //     const updatedAttendances = attendances.map(a =>
    //         a.id === attendanceID ? { ...a, [type]: newIsoTime } : a
    //     );
    //     setAttendances(updatedAttendances);
    // };




    // const handleTimeSave = async (attendanceID, type) => {
    //     const attendanceToUpdate = attendances.find(a => a.id === attendanceID);
    //     await updateDoc(doc(db, 'attendance', attendanceID), {
    //         [type]: attendanceToUpdate[type]
    //     });

    //     setRefreshKey(prevKey => prevKey + 1);  // Force a re-render
    // };

    const handleTimeEdit = (attendanceID, type, momentObj) => {
        // Convert moment object to JavaScript Date
        const newDate = momentObj.toDate();

        const newIsoTime = newDate.toISOString();

        const updatedAttendances = attendances.map(a =>
            a.id === attendanceID ? { ...a, [type]: newIsoTime } : a
        );
        setAttendances(updatedAttendances);
    };


    const handleTimeSave = async (attendanceID, type) => {
        const attendanceToUpdate = attendances.find(a => a.id === attendanceID);
        await updateDoc(doc(db, 'attendance', attendanceID), {
            [type]: attendanceToUpdate[type]
        });

        setEditingId(null); // Exit edit mode
        setRefreshKey(prevKey => prevKey + 1);  // Force a re-render
    };







    const calculateDuration = (start, end) => {
        const startTime = new Date(start);
        const endTime = end ? new Date(end) : new Date();
        const duration = (endTime - startTime) / (1000 * 60 * 60); // Duration in hours
        return duration.toFixed(2);
    };

    const calculateDurationWeek = (attendances) => {
        return attendances.reduce((total, attendance) => {
            return total + parseFloat(calculateDuration(attendance.clockInTime, attendance.clockOutTime));
        }, 0).toFixed(2);
    };


    const getTotalHours = (attendances) => {
        return attendances.reduce((total, attendance) => {
            return total + parseFloat(calculateDuration(attendance.clockInTime, attendance.clockOutTime));
        }, 0).toFixed(2);
    };

    const getWeekRange = (weekOffset) => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);  // Set to start of the day

        // Calculate the number of days to subtract to get to the start of the week (Monday)
        const daysToSubtract = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;
        currentDate.setDate(currentDate.getDate() - daysToSubtract);

        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(startOfWeek.getDate() + (7 * weekOffset));

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);

        return { startDate: startOfWeek, endDate: endOfWeek };
    };


    const { startDate, endDate } = getWeekRange(weekOffset);

    const formatTime = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return hours + ':' + minutes;
    };



    return (
        <div className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-800 transition-colors duration-200">
            <h1 className="text-2xl sm:text-4xl font-semibold mb-4 sm:mb-6 text-gray-800 dark:text-gray-200">Employee Timesheet</h1>
            <p className="mb-4 text-red-500 text-sm sm:text-base">*Be sure to use 24-hour time format when changing time. Do not modify AM/PM. E.g., 1PM = 13:00:00</p>

            {/* Dropdown to select a user */}
            <div className="mb-4 relative">
                <span className="block text-gray-700 dark:text-gray-300 mb-2">
                    Employee:
                </span>
                <select
                    value={selectedUserID}
                    onChange={e => setSelectedUserID(e.target.value)}
                    className="block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 px-2 sm:px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-300 dark:focus:border-blue-400"
                >
                    <option value="">Select a user</option>
                    {users.map(user => (
                        <option key={user.uid} value={user.uid}>
                            {user.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Navigation buttons for weeks */}
            <div className="mt-4 flex flex-col sm:flex-row items-center">
                <div className="flex mb-4 sm:mb-0">
                    <button className="ml-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-sm rounded px-2 py-1" onClick={() => setWeekOffset(weekOffset - 1)}>
                        Previous Week
                    </button>
                    <button className='ml-2 bg-indigo-500 hover:bg-blue-600 dark:bg-indigo-600 dark:hover:bg-blue-700 text-white text-sm rounded px-2 py-1' onClick={() => setWeekOffset(weekOffset + 1)}>
                        Next Week
                    </button>
                </div>
                <span className="text-base sm:text-lg font-semibold">
                    {startDate.toDateString().split(' ')[1]} {startDate.getDate()} - {endDate.toDateString().split(' ')[1]} {endDate.getDate()}
                </span>
            </div>

            {/* The table with editable cells */}
            <div className="mt-4 overflow-x-auto">
                <table className="min-w-full border-collapse border-gray-300 dark:border-gray-600">
                    <thead>
                        <tr>
                            <th className="border-b-2 py-2 bg-gray-200 dark:bg-gray-700 text-center px-2">Date</th>
                            <th className="border-b-2 py-2 bg-gray-200 dark:bg-gray-700 text-center px-2">In</th>
                            <th className="border-b-2 py-2 bg-gray-200 dark:bg-gray-700 text-center px-2">Out</th>
                            <th className="border-b-2 py-2 bg-gray-200 dark:bg-gray-700 text-center px-2">Total</th>
                            <th className="border-b-2 py-2 bg-gray-200 dark:bg-gray-700 text-center px-2">Geo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendances.map(a => (
                            <tr className='' key={a.id}>
                                {/* Display the date */}
                                <td className='text-sm md:text-base text-left'>{new Date(a.date.seconds * 1000).toDateString()}</td>

                                {/* Editable cell for clock in time */}
                                <td className="relative text-sm md:text-base dark:text-cyan-300 text-center">
                                    {editingId === a.id && editingType === 'clockInTime' ? (
                                        <div className="min-h-[200px]">
                                            <Datetime
                                                defaultValue={new Date(a.clockInTime)}
                                                inputProps={{ readOnly: true }}
                                                style={{ background: 'red' }}
                                                className="dark:bg-red-800 dark:text-black"
                                                onChange={date => handleTimeEdit(a.id, 'clockInTime', date)}
                                            />
                                            <button className="ml-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-sm rounded px-2 py-1" onClick={() => handleTimeSave(a.id, 'clockInTime')}>Save</button>
                                        </div>
                                    ) : (
                                        <>
                                            {new Date(a.clockInTime).toLocaleTimeString()} <br />
                                            <button className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white text-sm rounded px-2 py-1" onClick={() => { setEditingId(a.id); setEditingType('clockInTime'); }}>Edit</button>
                                        </>
                                    )}
                                </td>

                                {/* Editable cell for clock out time */}
                                <td className="relative text-sm md:text-base text-red-500 text-center">
                                    {editingId === a.id && editingType === 'clockOutTime' ? (
                                        <div className="min-h-[200px]">
                                            <Datetime
                                                defaultValue={new Date(a.clockOutTime)}
                                                inputProps={{ readOnly: true }}
                                                className="dark:bg-gray-800 dark:text-black"
                                                onChange={date => handleTimeEdit(a.id, 'clockOutTime', date)}
                                            />
                                            <button className="ml-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-sm rounded px-2 py-1" onClick={() => handleTimeSave(a.id, 'clockOutTime')}>Save</button>
                                        </div>
                                    ) : (
                                        a.clockOutTime ? (
                                            <>
                                                {new Date(a.clockOutTime).toLocaleTimeString()} <br />
                                                <button className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white text-sm rounded px-2 py-1" onClick={() => { setEditingId(a.id); setEditingType('clockOutTime'); }}>Edit</button>
                                            </>
                                        ) : "-"
                                    )}
                                </td>


                                {/* Total hours worked */}
                                <td className='text-sm md:text-base text-green-500 text-center'>
                                    {calculateDuration(a.clockInTime, a.clockOutTime)}
                                </td>
                                <td className='text-xs md:text-base text-right md:text-left'>{a.location} <br /></td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-gray-300 dark:bg-gray-700">
                        <tr>
                            <td className="px-4 py-2" colSpan="3">Total Hours for: <br /> <span>{startDate.toDateString().split(' ')[1]} {startDate.getDate()} - {endDate.toDateString().split(' ')[1]} {endDate.getDate()}</span></td>
                            <td className="px-4 py-2 text-green-500 text-left text-xl" colSpan="2">{calculateDurationWeek(attendances)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default TimeClockAdmin;
