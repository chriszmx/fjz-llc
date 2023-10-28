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
            currentDate.setDate(currentDate.getDate() + (7 * weekOffset));  // Adjust for weekOffset
            const startOfWeek = currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1); // Adjusting for Sunday being 0
            const endOfWeek = startOfWeek + 6;

            const startDate = new Date(currentDate);
            startDate.setDate(startOfWeek);
            startDate.setHours(0, 0, 0, 0); // Start of day

            const endDate = new Date(currentDate);
            endDate.setDate(endOfWeek);
            endDate.setHours(23, 59, 59, 999); // End of day

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

            console.log("Fetching attendance...", weekAttendances);
            setAttendances(weekAttendances);
            setIsClockedIn(!!weekAttendances.find(a => !a.clockOutTime && new Date(a.date).toDateString() === currentDate.toDateString())); // If there's any record without clockOutTime for today, user is clocked in.
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


    return (
        <div>
            {isClockedIn ? (
                <button onClick={handleClockOut}>Clock Out</button>
            ) : (
                <button onClick={handleClockIn}>Clock In</button>
            )}

            <table>
                <thead>
                    <tr>
                        <th>Clock In</th>
                        <th>Clock Out</th>
                        <th>Date</th>
                        <th>Duration (hrs)</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody>
                    {attendances.map(a => (
                        <tr key={a.id}>
                            <td>{new Date(a.clockInTime).toLocaleTimeString()}</td>
                            <td>{a.clockOutTime ? new Date(a.clockOutTime).toLocaleTimeString() : "-"}</td>
                            <td>{new Date(a.date.seconds * 1000).toDateString()}</td>
                            <td>{calculateDuration(a.clockInTime, a.clockOutTime)}</td>
                            <td>{a.location}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="2">Total Hours Today</td>
                        <td>{getTotalHours(attendances)}</td>
                    </tr>
                    <tr>
                        <td colSpan="2">Total Hours This Week</td>
                        <td>{calculateDurationWeek(attendances)}</td>
                    </tr>
                </tfoot>
            </table>
            <button onClick={() => setWeekOffset(weekOffset - 1)}>Previous Week</button>
            {weekOffset < 0 && <button onClick={() => setWeekOffset(weekOffset + 1)}>Next Week</button>}

        </div>
    );
};

export default TimeClock;
