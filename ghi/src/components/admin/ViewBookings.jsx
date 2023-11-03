import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase';;
const ViewBookings = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            const bookingsCollection = collection(db, 'bookings');
            const bookingsQuery = query(bookingsCollection, orderBy('date'), orderBy('time'));
            const bookingSnapshots = await getDocs(bookingsQuery);

            const fetchedBookings = bookingSnapshots.docs.map(doc => {
                const data = doc.data();
                const formattedDate = new Date(data.date.seconds * 1000).toLocaleDateString();
                return { ...data, date: formattedDate };
            });
            setBookings(fetchedBookings);
        }

        fetchBookings();
    }, []);

    return (
        <div className="bg-dark:bg-black text-dark:text-white p-8 min-h-screen flex flex-col justify-center">
            <h1 className='pb-20 text-center dark:text-gray-300'>Upcoming Bookings</h1>
            {bookings.length === 0 ? (
                <p className="text-2xl font-semibold text-center">No bookings have been scheduled.<br /><br /> Are any apartments available? Did Don actually finish? </p>
            ) : (
                bookings.map((booking, index) => (
                    <div key={index} className="mb-8 p-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-lg transition-transform transform hover:scale-105">
                        <h2 className="mb-4 text-2xl font-semibold text-gray-300 border-b-2 border-gray-500 pb-2">Booking for {booking.name}</h2>
                        <p className="mt-4 text-lg"><span className="font-semibold text-gray-400">Email:</span> {booking.email}</p>
                        <p className="mt-2 text-lg"><span className="font-semibold text-gray-400">Phone Number:</span> {booking.phoneNumber}</p>
                        <p className="mt-2 text-lg"><span className="font-semibold text-gray-400">Apartment:</span> {booking.apartment}</p>
                        <p className="mt-2 text-lg"><span className="font-semibold text-gray-400">Date:</span> {booking.date}</p>
                        <p className="mt-2 text-lg"><span className="font-semibold text-gray-400">Time:</span> {booking.time}</p>
                        {booking.additionalInfo && (
                            <p className="mt-2 text-lg"><span className="font-semibold text-gray-400">Additional Info:</span> {booking.additionalInfo}</p>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default ViewBookings;