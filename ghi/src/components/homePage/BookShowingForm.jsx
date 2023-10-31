import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { db } from '../../Firebase';
import { setDoc, doc, collection } from 'firebase/firestore';
import { toast } from 'react-toastify';
import bookingConf from '../../assets/bookingConf.png'


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
      // Email to the administrators
      await setDoc(doc(collection(db, 'mail')), {
        to: ['c.r.zambito@gmail.com'],
        // to: ['c.r.zambito@gmail.com', 'bz814@aol.com', 'fjzllc@gmail.com', 'synthia.taylor@yahoo.com'],
        message: {
          subject: `New Booking from ${formData.email}`,
          text: 'See Booking details below:',
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
            <p><strong>Note:</strong> To make sure everything runs smoothly, <strong>please send a text to <a href="tel:716-698-8355">716-698-8355</a> about 10 minutes before your scheduled time.</strong> This helps us ensure you're on your way!</p>
            <p>We understand that things come up, but no-shows can be quite challenging for our schedules. If you can't make it, just let us know. We appreciate the heads up!</p>
            <p>See you soon!</p>
            <p>- FJZ LLC Apartments Team</p>
          </div>
        `,

        }

      });
      toast.success('Your viewing has been scheduled! Please check your email/spam to confirm and follow next steps.');

    } catch (error) {
      console.error("Error sending email:", error);
    }
    setFormData(initialFormData); // reset the form
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
          <label value={formData.date} className="font-semibold text-white">Date</label>
          <DatePicker
            className="bg-gray-700 p-2 rounded w-full shadow-md transition duration-300 hover:shadow-lg"
            selected={formData.date}
            onChange={date => handleChangeForDate('date', date)}
            dateFormat="MMMM d, yyyy"
            calendarClassName="border border-gray-300"
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
      </form>
      <br /><br /><br /><br /><br />
    </div>
  );

}

export default BookShowingForm;
