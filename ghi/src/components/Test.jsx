import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../Firebase';
import { collection, onSnapshot, doc, updateDoc, query, where, getDocs } from "firebase/firestore";

function Test() {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState('what da heck');

  // useEffect hook to listen for authentication state
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const currentUserDoc = doc(firestore, 'users', user.uid);
        const unsubscribeUser = onSnapshot(currentUserDoc, (docSnapshot) => {
          if (docSnapshot.exists()) {
            setCurrentUserRole(docSnapshot.data().role);
          }
        });
        return unsubscribeUser;
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // useEffect hook to fetch all users
  useEffect(() => {
    const userCollection = collection(firestore, 'users');
    const unsubscribeUsers = onSnapshot(userCollection, (snapshot) => {
      const usersData = snapshot.docs.map(docSnapshot => ({
        uid: docSnapshot.id,
        ...docSnapshot.data()
      }));
      setUsers(usersData);
    }, (error) => {
      console.error("Error fetching users:", error);
    });

    return () => {
      unsubscribeUsers();
    };
  }, []);

  const handleRoleChange = async () => {
    if (selectedEmail && selectedRole) {
      try {
        const userQuery = query(collection(firestore, 'users'), where('email', '==', selectedEmail));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          await updateDoc(doc(firestore, 'users', userDoc.id), { role: selectedRole });
          alert('Role updated successfully!');
        } else {
          alert('No user found with the selected email.');
        }
      } catch (error) {
        console.error("Error updating role:", error);
        alert('Error updating role: ' + error.message);
      }
    } else {
      alert('Please select both a user and a role.');
    }
  };

  return (
    <div>
      <h1>All Users</h1>
      <h2>Logged in User Role: {currentUserRole}</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.uid}>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {currentUserRole === 'admin' && (
        <>
          <h2>Update Role</h2>
          <div>
            <select value={selectedEmail} onChange={e => setSelectedEmail(e.target.value)}>
              <option value="" disabled>Select User by Email</option>
              {users.map(user => (
                <option key={user.uid} value={user.email}>{user.email}</option>
              ))}
            </select>

            <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
              <option value="" disabled>Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="guest">Guest</option>
            </select>

            <button onClick={handleRoleChange}>Assign Role</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Test;
