import { useEffect, useState } from 'react';
import { getFirestore, collection, addDoc, doc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const TimeClock = () => {
    const db = getFirestore();
    const auth = getAuth();

    const [isClockedIn, setIsClockedIn] = useState(false);
    const [attendances, setAttendances] = useState([]);

    const [weekOffset, setWeekOffset] = useState(0);


    const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2hyaXN6bXgiLCJhIjoiY2xvOWNrbHJwMDh1eTJtbjFjN2RuM2ZqaiJ9.9eOlY2BnsF46Te7JgyeSuA';

    const userID = auth.currentUser?.uid;

    if (!auth.currentUser) {
        return <div>You must be logged in to clock in/out.</div>;
    }

    useEffect(() => {
        const fetchAttendance = async () => {
            if (!userID) return;

            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + (7 * weekOffset));
            const startOfWeek = currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1);
            const endOfWeek = startOfWeek + 6;

            const startDate = new Date(currentDate);
            startDate.setDate(startOfWeek);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(currentDate);
            endDate.setDate(endOfWeek);
            endDate.setHours(23, 59, 59, 999);


            const q = query(
                collection(db, 'attendance'),
                where('userID', '==', userID),
                where('date', '>=', startDate),
                where('date', '<=', endDate)
            );

            const querySnapshot = await getDocs(q);

            console.log("Start Date:", startDate.toDateString());
            console.log("End Date:", endDate.toDateString());

            const weekAttendances = [];
            querySnapshot.forEach(doc => {
                const data = doc.data();
                weekAttendances.push({
                    id: doc.id,
                    ...data
                });
            });

            const currentlyClockedIn = !!weekAttendances.find(a =>
                !a.clockOutTime &&
                new Date(a.date?.seconds * 1000).toDateString() === currentDate.toDateString()
            );
            console.log("Is currently clocked in:", currentlyClockedIn);

            weekAttendances.forEach(a => {
                console.log("Has clockOutTime:", !!a.clockOutTime);
                console.log("Date matches today:", new Date(a.date?.seconds * 1000).toDateString() === currentDate.toDateString());
            });

            console.log("Fetching attendance...", weekAttendances);
            setAttendances(weekAttendances);
            setIsClockedIn(currentlyClockedIn);
        };

        fetchAttendance();
    }, [db, userID, weekOffset]);




    const fetchAddressFromCoords = async (latitude, longitude) => {
        try {
            const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}`);
            const data = await response.json();
            return data.features[0].place_name; // Get the most relevant address
        } catch (error) {
            console.error("Error fetching address:", error);
            return "Unknown Location"; // Fallback value
        }
    };

    const getUserLocation = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    };


    const handleClockIn = async () => {
        try {
            const position = await getUserLocation();
            const { latitude, longitude } = position.coords;
            const locationAddress = await fetchAddressFromCoords(latitude, longitude);

            const attendanceData = {
                userID: userID,
                date: new Date(),
                clockInTime: new Date().toISOString(),
                clockOutTime: null,
                location: locationAddress
            };

            const attendanceDoc = await addDoc(collection(db, 'attendance'), attendanceData);
            setIsClockedIn(true);
            setAttendances(prev => [...prev, { id: attendanceDoc.id, ...attendanceData }]);
        } catch (error) {
            console.error("Error clocking in:", error);
        }
    };


    const handleClockOut = async () => {
        try {
            const lastAttendance = attendances.find(a => !a.clockOutTime);
            if (lastAttendance) {
                await updateDoc(doc(db, 'attendance', lastAttendance.id), {
                    clockOutTime: new Date().toISOString()
                });
                setIsClockedIn(false);
                fetchAttendance();  // Refresh the attendances after clocking out
            }
        } catch (error) {
            console.error("Error clocking out:", error);
        }
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
        currentDate.setDate(currentDate.getDate() + (7 * weekOffset));
        const startOfWeek = currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1);
        const endOfWeek = startOfWeek + 6;

        const startDate = new Date(currentDate);
        startDate.setDate(startOfWeek);

        const endDate = new Date(currentDate);
        endDate.setDate(endOfWeek);

        return { startDate, endDate };
    };

    const { startDate, endDate } = getWeekRange(weekOffset);





    return (
        <div className="p-6 bg-gray-200 text-black dark:bg-gray-900 dark:text-white h-screen cursor-default">
            <div className="flex items-center justify-between mb-6">
                {isClockedIn ? (
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded transition" onClick={handleClockOut}>Clock Out</button>
                ) : (
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded transition" onClick={handleClockIn}>Clock In</button>
                )}
                <span className="text-lg font-semibold">
                    {startDate.toDateString().split(' ')[1]} {startDate.getDate()} - {endDate.toDateString().split(' ')[1]} {endDate.getDate()}
                </span>
            </div>

            <table className="w-full text-center bg-gray-200 rounded-lg overflow-hidden dark:bg-gray-800 cursor-default">
                <thead className="bg-gray-300 dark:bg-gray-700">
                    <tr>
                        <th className="px-4 py-2">Clock In</th>
                        <th className="px-4 py-2">Clock Out</th>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Duration (hrs)</th>
                    </tr>
                </thead>
                <tbody>
                    {attendances.map(a => (
                        <tr key={a.id} className="even:bg-gray-400 dark:even:bg-gray-900">
                            <td className="px-4 py-2 border-t">{new Date(a.clockInTime).toLocaleTimeString()}</td>
                            <td className="px-4 py-2 border-t">{a.clockOutTime ? new Date(a.clockOutTime).toLocaleTimeString() : "-"}</td>
                            <td className="px-4 py-2 border-t">{new Date(a.date.seconds * 1000).toDateString()}</td>
                            <td className="px-4 py-2 border-t">{calculateDuration(a.clockInTime, a.clockOutTime)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot className="bg-gray-300 dark:bg-gray-700">
                    <tr>
                        <td className="px-4 py-2" colSpan="2">Total Hours Today</td>
                        <td className="px-4 py-2 text-green-500" colSpan="2">{getTotalHours(attendances)}</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2" colSpan="2">Total Hours This Week</td>
                        <td className="px-4 py-2 text-green-500" colSpan="2">{calculateDurationWeek(attendances)}</td>
                    </tr>
                </tfoot>
            </table>

            <div className="mt-6 flex">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-l transition mr-0.5" onClick={() => setWeekOffset(weekOffset - 1)}>Previous Week</button>
                {weekOffset < 0 && <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-r transition ml-0.5" onClick={() => setWeekOffset(weekOffset + 1)}>Next Week</button>}
            </div>
        </div>
    );
};

export default TimeClock;
