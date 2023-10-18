import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../../Firebase';
import { collection, onSnapshot, doc, updateDoc, query, where, getDocs } from "firebase/firestore";

function AssignRole() {
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
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">All Users</h1>
      <h2 className="text-xl mb-6">Logged in User Role: <span className="text-indigo-500">{currentUserRole}</span></h2>

      <table className="min-w-full bg-white rounded-md overflow-hidden shadow-md">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Role</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map(user => (
            <tr key={user.uid} className="hover:bg-gray-50">
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {currentUserRole === 'admin' && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-6 text-indigo-600">Update Role</h2>
          <div className="space-y-4">
            <select value={selectedEmail} onChange={e => setSelectedEmail(e.target.value)} className="w-full p-3 border rounded-md">
              <option value="" disabled>Select User by Email</option>
              {users.map(user => (
                <option key={user.uid} value={user.email}>{user.email}</option>
              ))}
            </select>

            <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="w-full p-3 border rounded-md">
              <option value="" disabled>Select Role</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
              <option value="guest">Guest</option>
              <option value="renter">Renter</option>
            </select>

            <button onClick={handleRoleChange} className="w-full p-3 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Assign Role
            </button>
          </div>
        </div>
      )}
    </div>
  );

}

export default AssignRole;
