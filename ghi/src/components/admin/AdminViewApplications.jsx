import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { app } from "../../Firebase";

const AdminViewApplications = () => {
    const [applications, setApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            const db = getFirestore(app);
            const data = await getDocs(collection(db, 'application'));
            const apps = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setApplications(apps);
        };

        fetchApplications();
    }, []);

    const handleStatusChange = async (appId, status) => {
        const db = getFirestore(app);
        await updateDoc(doc(db, 'application', appId), {
            status: status,
        });
        const updatedApplications = applications.map(app =>
            app.id === appId ? { ...app, status: status } : app
        );
        setApplications(updatedApplications);
        setSelectedApplication(prev => ({ ...prev, status: status }));
    };

    const handleDelete = async (appId) => {
        const db = getFirestore(app);
        await deleteDoc(doc(db, 'application', appId));
        const updatedApplications = applications.filter(app => app.id !== appId);
        setApplications(updatedApplications);
        setSelectedApplication(null);
    };

    const handleDeleteAndSendEmail = async (appId, email) => {
        await handleDelete(appId);

        // Call the cloud function to send an email
        const sendEmail = functions.httpsCallable('sendEmail');
        sendEmail({ email: email })
          .then(result => {
            console.log(result);
          })
          .catch(error => {
            console.error("Error sending email: ", error);
          });
    };



    const renderDetails = application => (
        <>
            {Object.entries(application).map(([key, value], index) => {
                if (key !== "id" && value !== "") {
                    return (
                        <div key={index} className="mb-2">
                            <strong>{key}:</strong> {value}
                        </div>
                    );
                }
                return null;
            })}
            <button className="bg-green-500 m-2 p-2 text-white" onClick={() => handleStatusChange(application.id, "accepted")}>Accept</button>
            <button className="bg-red-500 m-2 p-2 text-white" onClick={() => handleStatusChange(application.id, "denied")}>Deny</button>
            <button className="bg-red-500 m-2 p-2 text-white" onClick={() => handleDelete(application.id)}>Delete</button>
            <button className="bg-red-600 m-2 p-2 text-white" onClick={() => handleDeleteAndSendEmail(application.id, application.email)}>Delete and Send Email</button>
        </>



    );

    return (
        <div className="flex space-x-6">
            <div className="w-1/3">
                <h2 className="text-xl font-bold mb-4">Pending Applications</h2>
                {applications.filter(app => app.status === 'pending').map(application => (
                    <div key={application.id} onClick={() => setSelectedApplication(application)} className="cursor-pointer hover:bg-gray-200 p-2 rounded">
                        {application.email}
                    </div>
                ))}
                <h2 className="text-xl font-bold mb-4 mt-8">Approved Applications</h2>
                {applications.filter(app => app.status === 'accepted').map(application => (
                    <div key={application.id} onClick={() => setSelectedApplication(application)} className="cursor-pointer hover:bg-gray-200 p-2 rounded">
                        {application.email}
                    </div>
                ))}
                <h2 className="text-xl font-bold mb-4 mt-8">Denied Applications</h2>
                {applications.filter(app => app.status === 'denied').map(application => (
                    <div key={application.id} onClick={() => setSelectedApplication(application)} className="cursor-pointer hover:bg-gray-200 p-2 rounded">
                        {application.email}
                    </div>
                ))}
            </div>
            <div className="w-2/3 p-6 bg-white rounded shadow-lg">
                {selectedApplication ? renderDetails(selectedApplication) : <p>Select an application to view details.</p>}
            </div>
        </div>
    );
};

export default AdminViewApplications;
