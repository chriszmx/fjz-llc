import React, { useState, useEffect } from "react";
import {
    collection,
    query,
    orderBy,
    getDocs,
    doc,
    deleteDoc,
    setDoc,
    onSnapshot
} from "firebase/firestore";
import { db, app } from "../../Firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";


const ViewBookings = ({ onBookingCountChange }) => {
    const [bookings, setBookings] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, user => {
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const unsubscribeUser = onSnapshot(userDocRef, docSnapshot => {
                    if (docSnapshot.exists && docSnapshot.data().role === 'admin') {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false);
                    }
                });
                return unsubscribeUser;
            }
        });

        return () => unsubscribeAuth();
    }, [auth]);

    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        // Call the prop function to send the count back, if it exists
        if(onBookingCountChange && typeof onBookingCountChange === 'function') {
            onBookingCountChange(bookings.length);
        }
    }, [bookings, onBookingCountChange]);


    const fetchBookings = async () => {
        const bookingsCollection = collection(db, "bookings");
        const bookingsQuery = query(
            bookingsCollection,
            orderBy("date"),
            orderBy("time")
        );
        const bookingSnapshots = await getDocs(bookingsQuery);

        const fetchedBookings = bookingSnapshots.docs.map((doc) => ({
            id: doc.id, // Keep document ID for deletion reference
            ...doc.data(),
            date: new Date(doc.data().date.seconds * 1000).toLocaleDateString(),
        }));

        setBookings(fetchedBookings);
    };

    const cancelBooking = async (id) => {
        // Confirm with the user
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            // Delete the booking from Firestore
            await deleteDoc(doc(db, "bookings", id));
            // Fetch the updated list of bookings
            fetchBookings();
        }
    };

    // Organize bookings by date
    const bookingsByDate = bookings.reduce((acc, booking) => {
        if (!acc[booking.date]) {
            acc[booking.date] = [];
        }
        acc[booking.date].push(booking);
        return acc;
    }, {});

    const sendConfirmationEmail = async (booking) => {
        if (
            window.confirm(
                "Do you want to send a confirmation email to " +
                    booking.email +
                    "?"
            )
        ) {
            try {
                // Here you should use a unique ID for each email. For simplicity, we're using booking.id here,
                // but in a real-world scenario, you would want something that reflects that this is an email document.
                const mailRef = doc(collection(db, "mail"), booking.id);
                await setDoc(mailRef, {
                    to: [booking.email], // Using the email from the booking
                    message: {
                        subject: "Booking Reminder",
                        text: "Thank you for booking with us. This is a confirmation reminder:",
                        html: `
                <div style="font-family: Arial, sans-serif; padding: 15px; background-color: #f7f7f7; border: 1px solid #e4e4e4; border-radius: 5px;">
                  <h2 style="color: #333; margin-top: 0;">Booking Confirmation</h2>
                  <p>Hey ${booking.name},</p>
                  <p>Thanks for booking a viewing with us! We're excited to show you around. Here's a recap of your booking details:</p>
                  <p><strong>Apartment:</strong> ${booking.apartment}</p>
                  <p><strong>Date:</strong> ${booking.date}</p>
                  <p><strong>Time:</strong> ${booking.time}</p>
                  <p></p>
                  <p><strong>Note:</strong> To make sure everything runs smoothly, please send a text to <a href="tel:716-698-8355">716-698-8355</a> about 15 minutes before your scheduled time. This helps us ensure you're on your way!</p>
                  <p>We understand that things come up, but no-shows can be quite challenging for our schedules. If you can't make it, just let us know. We appreciate the heads up!</p>
                  <p>See you soon!</p>
                  <p>- FJZ LLC Apartments Team</p>
                </div>
                `,
                    },
                });
                alert(`Confirmation email sent to ${booking.email}`);
            } catch (error) {
                console.error("Error sending email: ", error);
                alert("Failed to send confirmation email.");
            }
        }
    };

    if (!isAdmin) {
        return <div>You do not have permission to view this page.</div>;
    }


    return (
        <div className="bg-dark:bg-black text-dark:text-white p-8 min-h-screen flex flex-col justify-center">
            <h1 className="text-4xl mb-10 text-center dark:text-gray-300">
                Upcoming Bookings
            </h1>
            <p className="text-center dark:text-gray-400 mb-4">
                *Old bookings will be automatically deleted.
            </p>

            {/* Summary of bookings by date */}
            <div className="w-full max-w-6xl">
                {Object.entries(bookingsByDate).map(
                    ([date, bookingsForDate]) => (
                        <div key={date} className="mb-4">
                            <p className="text-xl text-blue-600 dark:text-yellow-300 text-center">
                                You have {bookingsForDate.length} showings on{" "}
                                {date}
                            </p>
                        </div>
                    )
                )}

                {bookings.length === 0 ? (
                    <p className="text-2xl font-semibold text-center">
                        No bookings have been scheduled.
                        <br />
                        <br /> Are any apartments available? Did Don actually
                        finish?{" "}
                    </p>
                ) : (
                    bookings.map((booking, index) => (
                        <div
                            key={index}
                            className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg transform transition-transform hover:scale-105"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-300 border-b-2 border-gray-500 pb-2">
                                Booking for {booking.name}
                            </h2>
                            <p className="mt-4 text-lg">
                                <span className="font-semibold dark:text-gray-400">
                                    Email:
                                </span>{" "}
                                {booking.email}
                            </p>
                            <p className="mt-2 text-lg">
                                <span className="font-semibold dark:text-gray-400">
                                    Phone Number:
                                </span>{" "}
                                {booking.phoneNumber}
                            </p>
                            <p className="mt-2 text-lg">
                                <span className="font-semibold dark:text-gray-400">
                                    Apartment:
                                </span>{" "}
                                {booking.apartment}
                            </p>
                            <p className="mt-2 text-lg">
                                <span className="font-semibold dark:text-gray-400">
                                    Date:
                                </span>{" "}
                                {booking.date}
                            </p>
                            <p className="mt-2 text-lg">
                                <span className="font-semibold dark:text-gray-400">
                                    Time:
                                </span>{" "}
                                {booking.time}
                            </p>
                            {booking.additionalInfo && (
                                <p className="mt-2 text-lg">
                                    <span className="font-semibold dark:text-gray-400">
                                        Additional Info:
                                    </span>{" "}
                                    {booking.additionalInfo}
                                </p>
                            )}
                            <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3 mt-4">
                                {/* Send Confirmation Button */}
                                <button
                                    onClick={() =>
                                        sendConfirmationEmail(booking)
                                    }
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 shadow-lg"
                                >
                                    Send Confirmation
                                </button>

                                {/* Delete Button */}
                                <button
                                    onClick={() => cancelBooking(booking.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50 shadow-lg"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ViewBookings;
