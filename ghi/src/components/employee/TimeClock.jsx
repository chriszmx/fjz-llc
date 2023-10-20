import { useEffect, useState } from 'react';
import { getFirestore, collection, addDoc, doc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const TimeClock = () => {
    const db = getFirestore();
    const auth = getAuth();
    if (!auth.currentUser) {
        return <div>You must be logged in to clock in/out.</div>;
    }
    const userID = auth.currentUser.uid;

    const [isClockedIn, setIsClockedIn] = useState(false);
    const [currentAttendanceData, setCurrentAttendanceData] = useState(null);
    const [currentAttendanceDoc, setCurrentAttendanceDoc] = useState(null);


    useEffect(() => {
        // Separate async function to handle attendance fetching
        const fetchAttendance = async () => {
            if (!userID) {
                console.warn("User ID not available for attendance check.");
                return;
            }

            try {
                const todayDate = new Date().toDateString();
                const q = query(
                    collection(db, 'attendance'),
                    where('userID', '==', userID),
                    where('date', '==', todayDate)
                );
                const querySnapshot = await getDocs(q);

                const attendanceDoc = querySnapshot.docs[0];
                if (attendanceDoc) {
                    setIsClockedIn(true);
                    setCurrentAttendanceDoc(attendanceDoc);
                    setCurrentAttendanceData(attendanceDoc.data());
                } else {
                    setIsClockedIn(false);  // Set false if no attendance found for the day
                    setCurrentAttendanceDoc(null);
                    setCurrentAttendanceData(null);
                }
            } catch (error) {
                console.error("Error fetching attendance:", error);
            }
        };

        fetchAttendance();
    }, [db, userID]);


    const handleClockIn = async () => {
        try {
            const attendanceDoc = await addDoc(collection(db, 'attendance'), {
                userID: userID,
                date: new Date().toDateString(),
                clockInTime: new Date().toISOString()
            });
            setIsClockedIn(true);
            setCurrentAttendanceDoc(attendanceDoc);
        } catch (error) {
            console.error("Error clocking in:", error);
        }
    };

    const handleClockOut = async () => {
        try {
            const clockOutTime = new Date().toISOString();
            await updateDoc(doc(db, 'attendance', currentAttendanceDoc.id), {
                clockOutTime: clockOutTime
            });

            // Using currentAttendanceData for the log
            console.log(`Shift details: Clocked in at ${currentAttendanceData.clockInTime} and clocked out at ${clockOutTime}`);

            setIsClockedIn(false);
        } catch (error) {
            console.error("Error clocking out:", error);
        }
    };

    return (
        <div>
            {isClockedIn ? (
                <button onClick={handleClockOut}>Clock Out</button>
            ) : (
                <button onClick={handleClockIn}>Clock In</button>
            )}
        </div>
    );
};

export default TimeClock;
