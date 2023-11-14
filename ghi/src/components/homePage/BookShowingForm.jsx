import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { db } from '../../Firebase';
import { setDoc, doc, collection } from 'firebase/firestore';
import { toast } from 'react-toastify';
import bookingConf from '../../assets/bookingConf.png'
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";



const BookShowingForm = () => {

  const initialFormData = {
    name: '',
    phoneNumber: '',
    email: '',
    apartment: '',
    date: null,
    time: '',
    additionalInfo: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showModal, setShowModal] = useState(false);


  const dayToTimeMapping = {
    "Sunday": ['Football Sunday, Sorry.'],  // No hours on Sunday
    "Monday": [
      "7:00 AM", "7:15 AM", "7:30 AM", "7:45 AM",
      "8:00 AM", "8:15 AM", "8:30 AM", "8:45 AM",
      "9:00 AM", "9:15 AM", "9:30 AM", "9:45 AM",
      "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM",
      "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM",
      "12:00 PM", "12:15 PM", "12:30 PM", "12:45 PM",
      "1:00 PM", "1:15 PM", "1:30 PM", "1:45 PM",
      "2:00 PM", "2:15 PM", "2:30 PM", "2:45 PM",
      "3:00 PM", "3:15 PM", "3:30 PM", "3:45 PM",
      "4:00 PM", "4:15 PM", "4:30 PM", "4:45 PM",
      "5:00 PM"
    ],
    "Tuesday": [
      "7:00 AM", "7:15 AM", "7:30 AM", "7:45 AM",
      "8:00 AM", "8:15 AM", "8:30 AM", "8:45 AM",
      "9:00 AM", "9:15 AM", "9:30 AM", "9:45 AM",
      "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM",
      "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM",
      "12:00 PM", "12:15 PM", "12:30 PM", "12:45 PM",
      "1:00 PM", "1:15 PM", "1:30 PM", "1:45 PM",
      "2:00 PM", "2:15 PM", "2:30 PM", "2:45 PM",
      "3:00 PM", "3:15 PM", "3:30 PM", "3:45 PM",
      "4:00 PM", "4:15 PM", "4:30 PM", "4:45 PM",
      "5:00 PM"
    ],
    "Wednesday": [
      "7:00 AM", "7:15 AM", "7:30 AM", "7:45 AM",
      "8:00 AM", "8:15 AM", "8:30 AM", "8:45 AM",
      "9:00 AM", "9:15 AM", "9:30 AM", "9:45 AM",
      "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM",
      "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM",
      "12:00 PM", "12:15 PM", "12:30 PM", "12:45 PM",
      "1:00 PM", "1:15 PM", "1:30 PM", "1:45 PM",
      "2:00 PM", "2:15 PM", "2:30 PM", "2:45 PM",
      "3:00 PM", "3:15 PM", "3:30 PM", "3:45 PM",
      "4:00 PM", "4:15 PM", "4:30 PM", "4:45 PM",
      "5:00 PM"
    ],
    "Thursday": [
      "7:00 AM", "7:15 AM", "7:30 AM", "7:45 AM",
      "8:00 AM", "8:15 AM", "8:30 AM", "8:45 AM",
      "9:00 AM", "9:15 AM", "9:30 AM", "9:45 AM",
      "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM",
      "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM",
      "12:00 PM", "12:15 PM", "12:30 PM", "12:45 PM",
      "1:00 PM", "1:15 PM", "1:30 PM", "1:45 PM",
      "2:00 PM", "2:15 PM", "2:30 PM", "2:45 PM",
      "3:00 PM", "3:15 PM", "3:30 PM", "3:45 PM",
      "4:00 PM", "4:15 PM", "4:30 PM", "4:45 PM",
      "5:00 PM"
    ],
    "Friday": [
      "7:00 AM", "7:15 AM", "7:30 AM", "7:45 AM",
      "8:00 AM", "8:15 AM", "8:30 AM", "8:45 AM",
      "9:00 AM", "9:15 AM", "9:30 AM", "9:45 AM",
      "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM",
      "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM",
      "12:00 PM", "12:15 PM", "12:30 PM", "12:45 PM",
      "1:00 PM", "1:15 PM", "1:30 PM", "1:45 PM",
      "2:00 PM", "2:15 PM", "2:30 PM", "2:45 PM",
      "3:00 PM", "3:15 PM", "3:30 PM", "3:45 PM",
      "4:00 PM", "4:15 PM", "4:30 PM", "4:45 PM",
      "5:00 PM"
    ],
    "Saturday": [
      "8:00 AM", "8:15 AM", "8:30 AM", "8:45 AM",
      "9:00 AM", "9:15 AM", "9:30 AM", "9:45 AM",
      "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM",
      "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM",
      "12:00 PM"
    ]
  };

  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    if (formData.date) {
      const dayName = formData.date.toLocaleDateString('en-US', { weekday: 'long' });
      setAvailableTimes(dayToTimeMapping[dayName] || []);
    } else {
      setAvailableTimes([]);
    }
  }, [formData.date]);


  const handleChange = (event) => {
    console.log(event.target);  // This will log the entire target element
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  function getOrdinalSuffix(n) {
    const s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function formatDate(date) {
    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const day = date.getDate();
    return formattedDate.replace(day, getOrdinalSuffix(day));
  }

  const handleChangeForDate = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);

    try {
      const downloadURL = await handleFormSubmit();
      // Now you have the downloadURL, you can use it in the email content

      // Email to the user with the download link
      await setDoc(doc(collection(db, 'mail')), {
        to: ['c.r.zambito@gmail.com', 'fjzllc@gmail.com', 'bz814@aol.com'],
        message: {
          subject: 'Booking Confirmation',
          text: 'Thank you for booking with us. See your booking details below:',
          html: `
  <div style="font-family: Arial, sans-serif; padding: 15px; background-color: #f7f7f7; border: 1px solid #e4e4e4; border-radius: 5px;">
    <h2 style="color: #333; margin-top: 0;">New Booking Alert!</h2>
    <p><strong>Name:</strong> ${formData.name}</p>
    <p><strong>Phone Number:</strong> ${formData.phoneNumber}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Apartment:</strong> ${formData.apartment}</p>
    <p><strong>Date:</strong> ${formatDate(formData.date)}</p>
    <p><strong>Time:</strong> ${formData.time}</p>
    <p><strong>Additional Info:</strong> ${formData.additionalInfo}</p>
    <p><a href="${downloadURL}" target="_blank" style="background-color: #4CAF50; color: white; padding: 14px 20px; margin: 8px 0; border: none; cursor: pointer; width: 50%; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;">Save to Calendar</a></p>
  </div>
`,

        }
      });

      // Email to the user
      await setDoc(doc(collection(db, 'mail')), {
        to: [formData.email],
        message: {
          subject: 'Booking Confirmation',
          text: 'Thank you for booking with us. See your booking details below:',
          html: `
          <div style="font-family: Arial, sans-serif; padding: 15px; background-color: #f7f7f7; border: 1px solid #e4e4e4; border-radius: 5px;">
            <h2 style="color: #333; margin-top: 0;">Booking Confirmation</h2>
            <p>Hey ${formData.name},</p>
            <p>Thanks for booking a viewing with us! We're excited to show you around. Here's a recap of your booking details:</p>
            <p><strong>Apartment:</strong> ${formData.apartment}</p>
            <p><strong>Date:</strong> ${formatDate(formData.date)}</p>
            <p><strong>Time:</strong> ${formData.time}</p>
            <p></p>
            <p><strong>Note:</strong> To make sure everything runs smoothly, <strong>please send a text to <a href="tel:716-912-8764">716-912-8764</a> about 15 minutes before your scheduled time.</strong> This helps us ensure you're on your way!</p>
            <p>We understand that things come up, but no-shows can be quite challenging for our schedules. If you can't make it, just let us know. We appreciate the heads up!</p>
            <p>See you soon!</p>
            <p>- FJZ LLC Apartments Team</p>
            <p><a href="${downloadURL}" target="_blank" style="background-color: #4CAF50; color: white; padding: 14px 20px; margin: 8px 0; border: none; cursor: pointer; width: 50%; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;">Save to Calendar</a></p>
          </div>

        `,

        }

      });

      // store reference in db for admin to view
      await setDoc(doc(collection(db, 'bookings')), {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        apartment: formData.apartment,
        date: formData.date,
        time: formData.time,
        additionalInfo: formData.additionalInfo
      });

      toast.success(`Your viewing has been scheduled! Please check your email/spam to confirm and follow next steps. `);
      setShowModal(true);

    } catch (error) {
      console.error("Error sending email:", error);
    }
    // setFormData(initialFormData); // reset the form
  };

  function generateICSFile(formData) {
    const { date, time, apartment, name, additionalInfo, phoneNumber } = formData;

    // Convert the date and time to a Date object
    const dateTime = new Date(`${date.toDateString()} ${time}`);
    const formattedStart = formatDateTime(dateTime);

    // Assuming the event lasts for 1 hour
    const endDateTime = new Date(dateTime.getTime() + 30 * 60 * 1000);
    const formattedEnd = formatDateTime(endDateTime);

    // Additional instructions for the event
    const instructions = `
  To make sure everything runs smoothly, please send a text to 716-912-8764 about 15 minutes before your scheduled time. This helps us ensure you're on your way!

  We understand that things come up, but no-shows can be quite challenging for our schedules. If you can't make it, just let us know. We appreciate the heads up!

  See you soon!

  - FJZ LLC Apartments Team

  `;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'CALSCALE:GREGORIAN',
      `UID:${generateUID()}`,
      'BEGIN:VTIMEZONE',
      'TZID:America/New_York',
      'END:VTIMEZONE',
      'BEGIN:VEVENT',
      `DTSTART;TZID=America/New_York:${formattedStart}`,
      `DTEND;TZID=America/New_York:${formattedEnd}`,
      `SUMMARY:🏡 Apartment Viewing: ${apartment} Name: ${name}`,
      `LOCATION:${apartment}`,
      `DESCRIPTION:${formatDescription(instructions + "\\nAdditional Info: " + additionalInfo + "\\n" + formData.name + ", " + formData.phoneNumber)}`,
      'STATUS:CONFIRMED',
      'CATEGORIES:Apartment Viewing',
      `ORGANIZER;CN="FJZ LLC Apartments":mailto:fjzllc@gmail.com`,
      'ATTENDEE;CN="Frank":mailto:fjzllc@gmail.com',
      'ATTENDEE;CN="Chris":mailto:c.r.zambito@gmail.com',
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder',
      'TRIGGER:-PT15M',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    return icsContent;
  }

  function generateUID() {
    return 'uid-' + Math.random().toString(36).substr(2, 10) + '@example.com';
  }

  function formatDateTime(date) {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
  }

  function formatDescription(description) {
    // Escape newlines, commas, and semicolons for the ICS format
    return description.replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  }


  const handleDownloadICS = () => {
    if (!formData.date) {
      toast.error("Please select a date before downloading the calendar file.");
      return;
    }

    const icsContent = generateICSFile(formData);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', 'appointment.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  async function handleFormSubmit() {
    // Generate the ICS content
    const icsContent = generateICSFile(formData);

    // Get a reference to the storage service
    const storage = getStorage();

    // Create a storage reference from our storage service
    const icsRef = ref(storage, 'calendarFiles/' + formData.name + '.ics');

    // Upload ICS content as a string
    await uploadString(icsRef, icsContent);

    // Get the download URL
    const downloadURL = await getDownloadURL(icsRef);

    // Return the download URL so it can be used in the email
    return downloadURL;
  }

  async function sendEmailWithICSLink(downloadURL) {
    // Set up your email content
    const emailContent = {
      // to: [formData.email],
      to: ['c.r.zambito@gmail.com'],
      message: {
        subject: 'Booking Confirmation',
        text: 'Thank you for booking with us. See your booking details below:',
        html: `TEST TEST TEST
          <div style="font-family: Arial, sans-serif; padding: 15px; background-color: #f7f7f7; border: 1px solid #e4e4e4; border-radius: 5px;">
            ... [Other HTML Content] ...
            <p><a href="${downloadURL}" target="_blank" style="background-color: #4CAF50; color: white; padding: 14px 20px; margin: 8px 0; border: none; cursor: pointer; width: 50%; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;">Save to Calendar</a></p>
          </div>
        `,
      }
    };

    // Use Firestore to trigger the email function
    await setDoc(doc(collection(db, 'mail')), emailContent);
  }


  const CalendarModal = ({ onClose, onAddToCalendar }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-4 rounded-lg shadow-lg text-center">
          <h2>Congrats! 🎉 🥳 🍾 One step closer to your new apartment! 🏡</h2>
          <p>Next steps:</p>
          <h3>Add to your calendar 📅</h3>
          <p>Check your email / spam for confirmation email with further steps! 📧</p>
          {/* <h3 className="text-lg font-bold">Add to Calendar</h3>
          <p>Would you like to add this event to your calendar?</p> */}
          <div className="mt-4 space-x-2">
            <button onClick={onAddToCalendar} target="_blank" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Add to Calendar</button>
            {/* <button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">No</button> */}
          </div>
        </div>
      </div>
    );
  };

  const handleCloseModalAndResetForm = () => {
    setShowModal(false);
    setFormData(initialFormData); // Reset the form data here
  };




  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center text-gray-400 p-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">Schedule a Viewing</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-8 space-y-6 border-2 border-indigo-400">
        <img src={bookingConf} alt="booking" className='rounded-lg w-full md:w-3/4 mx-auto my-4 shadow-md' />
        {/* Input Fields */}
        <div className="flex flex-col space-y-2">
          <label className="font-semibold text-white" htmlFor="name">Name</label>
          <input value={formData.name} className="bg-gray-700 p-2 rounded shadow-md transition duration-300 hover:shadow-lg" id="name" name="name" onChange={handleChange} placeholder="Enter your name" required />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-semibold text-white" htmlFor="phoneNumber">Phone Number</label>
          <input value={formData.phoneNumber} className="bg-gray-700 p-2 rounded shadow-md transition duration-300 hover:shadow-lg" id="phoneNumber" name="phoneNumber" onChange={handleChange} placeholder="Enter your phone number" required />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-semibold text-white" htmlFor="email">Email</label>
          <input value={formData.email} className="bg-gray-700 p-2 rounded shadow-md transition duration-300 hover:shadow-lg" id="email" name="email" type="email" onChange={handleChange} placeholder="Enter your email" required />
        </div>

        {/* Dropdown Fields */}
        <div className="flex flex-col space-y-2">
          <label className="font-semibold text-white" htmlFor="apartment">Apartment</label>
          <select value={formData.apartment} className="bg-gray-700 p-2 rounded shadow-md transition duration-300 hover:shadow-lg" id="apartment" name="apartment" onChange={handleChange} required>
            <option value="">Select an apartment</option>
            <option value="1108 Kenmore Ave Apt 5">1108 Kenmore Ave Apt 5</option>
            {/* <option value="Apt 2">Apt 2</option> */}
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-semibold text-white">Date</label>
          <DatePicker
            className="bg-gray-700 p-2 rounded w-full shadow-md transition duration-300 hover:shadow-lg"
            selected={formData.date}
            onChange={date => handleChangeForDate('date', date)}
            dateFormat="MMMM d, yyyy"
            calendarClassName="border border-gray-300"
            shouldCloseOnSelect={false}
            customInput={
              <input
                onFocus={(e) => {
                  e.preventDefault();
                  e.target.blur();
                }}
                onClick={(e) => {
                  e.preventDefault();
                }}
              />
            }
            required
          />
        </div>


        <div className="flex flex-col space-y-2">
          <label className="font-semibold text-white" htmlFor="time">Time</label>
          <select value={formData.time} className="bg-gray-700 p-2 rounded shadow-md transition duration-300 hover:shadow-lg" id="time" name="time" onChange={handleChange} required>
            <option value="">Select a time</option>
            {availableTimes.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-semibold text-white" htmlFor="additionalInfo">Additional Info</label>
          <textarea value={formData.additionalInfo} className="bg-gray-700 p-2 rounded shadow-md transition duration-300 hover:shadow-lg" id="additionalInfo" name="additionalInfo" onChange={handleChange} placeholder="Enter any additional information" />
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-gray-100 p-2 rounded shadow-md transition duration-300 hover:shadow-lg transform hover:-translate-y-1">Book</button>

        {showModal && (
    <CalendarModal
      onClose={handleCloseModalAndResetForm}
      onAddToCalendar={() => {
        handleDownloadICS();
        setShowModal(false);
      }}
    />
  )}

        <p>*After booking please check email/spam for confirmation and following steps from: <br /><br /> FJZ LLC noreply@fjzapartments.com</p>
        <p>*To make sure everything runs smoothly, you will also be provided a phone number to <strong>text 15 minutes before showing up to apartment.</strong> This helps us ensure you're on your way.</p>
      </form>
      <br /><br /><br /><br /><br />
    </div>
  );

}

export default BookShowingForm;
