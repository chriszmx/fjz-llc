import React, { useState } from 'react';
import { firestore } from '../Firebase';  // adjust the path if it's different
import { addDoc, collection } from 'firebase/firestore';  // NEW import

const ApplicationForm = () => {
  const [date, setDate] = useState("");
  const [occupants, setOccupants] = useState("");
  const [favoriteColor, setFavoriteColor] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a new application entry in the 'application' collection
    try {
      const docRef = await addDoc(collection(firestore, 'application'), {
        date,
        occupants: Number(occupants),
        favoriteColor
      });
      console.log("Document written with ID: ", docRef.id);

      // Reset form values
      setDate("");
      setOccupants("");
      setFavoriteColor("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Date: </label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>
      <div>
        <label>Occupants: </label>
        <input
          type="number"
          value={occupants}
          onChange={e => setOccupants(e.target.value)}
        />
      </div>
      <div>
        <label>Favorite Color: </label>
        <input
          type="text"
          value={favoriteColor}
          onChange={e => setFavoriteColor(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ApplicationForm;
