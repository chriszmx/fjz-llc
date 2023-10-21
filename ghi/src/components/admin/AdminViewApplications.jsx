import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { app } from "../../Firebase";
// import { getStorage } from "firebase/storage";

const AdminViewApplications = () => {
    const [applications, setApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState(null);

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
        const storage = getStorage(app);

        // 1. Fetch the application entry
        const appDocRef = doc(db, 'application', appId);
        const appSnapshot = await getDoc(appDocRef);
        const appData = appSnapshot.data();

        if (appData) {
            // Array of the keys that point to image URLs in your Firestore doc.
            const imageKeys = ["ID Proof", "Proof Income 1", "Proof Income 2"];

            // 2. Parse the URLs to get the storage paths
            const imagePaths = imageKeys.map(key => {
                if (appData[key]) {
                    const imageUrl = appData[key];
                    // Extract the path from the URL
                    // Assuming your URLs look something like: https://firebasestorage.googleapis.com/v0/b/your-app-id.appspot.com/o/path-to-file?token=token-value
                    // The following will extract 'path-to-file'
                    const pathRegex = /o\/(.*?)\?/;
                    const match = imageUrl.match(pathRegex);
                    return match ? match[1] : null;
                }
                return null;
            }).filter(path => !!path); // Remove null values

            // 3. Delete each file from Firebase Storage
            for (const imagePath of imagePaths) {
                const imageRef = ref(storage, decodeURIComponent(imagePath)); // Decode URI since Firebase Storage path in the URL will be encoded
                try {
                    await deleteObject(imageRef);
                } catch (error) {
                    console.error("Error deleting file from storage:", imagePath, error);
                }
            }
        }

        // Delete the document from Firestore
        await deleteDoc(appDocRef);

        // Update local state
        const updatedApplications = applications.filter(app => app.id !== appId);
        setApplications(updatedApplications);
        setSelectedApplication(null);
    };


    const handleDeleteAndSendEmail = async (appId, email) => {
        const db = getFirestore(app);

        // Create a notification document
        const notificationRef = doc(collection(db, 'mail'));
        await setDoc(notificationRef, {
            to: email,
            message: {
                subject: 'Application Update',
                text: 'you have been denied',
                html: 'Thank you for application, unfortunately, you have not been selected at this time. Please keep an eye out for other opportunities that peak your interest.',
            }
        });

        // Delete the application
        await handleDelete(appId);
    };

    const handleAcceptAndSendEmail = async (email) => {
        console.log("Trying to send acceptance email to:", email);
        const db = getFirestore(app);
        const notificationRef = doc(collection(db, 'mail'));
        await setDoc(notificationRef, {
            to: email,
            message: {
                subject: 'Application Update',
                text: 'you have been accepted',
                html: 'Thank you for your application, you have been accepted. You will receive an email/text message within the next 24 hours with steps to move forward. Thank you and congratulations!',
            }
        });
    };

    const executeAction = () => {
        if (selectedApplication) {
            switch (actionType) {
                case 'accept':
                    handleStatusChange(selectedApplication.id, 'accepted');
                    break;
                case 'sendAcceptanceEmail':
                    handleAcceptAndSendEmail(selectedApplication.email);
                    break;
                case 'deny':
                    handleStatusChange(selectedApplication.id, 'denied');
                    break;
                case 'delete':
                    handleDelete(selectedApplication.id);
                    break;
                case 'deleteAndSendEmail':
                    handleDeleteAndSendEmail(selectedApplication.id, selectedApplication.email);
                    break;
                case 'sendApplicationByEmail':
                    sendApplicationByEmail(selectedApplication);
                    break;
                default:
                    break;
            }
        }
        setShowModal(false);
        setActionType(null);
    };

    const openModal = (type) => {
        setActionType(type);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setActionType(null);
    };

    const renderModal = () => {
        if (!showModal || !actionType) return null;

        const message = {
            accept: 'Confirm application acceptance?',
            sendAcceptanceEmail: 'Confirm sending acceptance email?',
            deny: 'Confirm application denial?',
            delete: '**WARNING** Confirm application deletion? WILL NOT NOTIFIY APPLICANT.',
            deleteAndSendEmail: 'Confirm application deletion and sending of email?',
            sendApplicationByEmail: 'Confirm sending of application details email?',
        };

        return (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded shadow-md">
                    <p>{message[actionType]}</p>
                    <div className="flex justify-end mt-4">
                        <button className="bg-green-500 m-2 p-2 text-white" onClick={executeAction}>Confirm</button>
                        <button className="bg-red-500 m-2 p-2 text-white" onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    };




    const renderDetails = application => (
        <>
            {Object.entries(application).map(([key, value], index) => {
                if (key !== "id" && value !== "") {
                    if (["ID Proof", "Proof Income 1", "Proof Income 2"].includes(key) && value.startsWith("https://firebasestorage.googleapis.com/")) {
                        return (
                            <div key={index} className="mb-2">
                                <strong>{key}:</strong>
                                <div>
                                    <img src={value} alt="Application related" className="max-w-xs"/>
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div key={index} className="mb-2">
                            <strong>{key}:</strong> {value}
                        </div>
                    );
                }
                return null;
            })}
            <button className="bg-green-400 m-2 p-2 text-white rounded-lg" onClick={() => openModal('accept')}>Accept</button>
            <button className="bg-green-600 m-2 p-2 text-white rounded-lg" onClick={() => openModal('sendAcceptanceEmail')}>Send Acceptance Email</button>
            <button className="bg-red-500 m-2 p-2 text-white rounded-lg" onClick={() => openModal('deny')}>Deny</button>
            <button className="bg-red-600 m-2 p-2 text-white rounded-lg" onClick={() => openModal('delete')}>Delete</button>
            <button className="bg-red-900 m-2 p-2 text-white rounded-lg" onClick={() => openModal('deleteAndSendEmail')}>Delete and Send Email</button>
            <button className="bg-blue-500 m-2 p-2 text-white rounded-lg" onClick={() => openModal('sendApplicationByEmail')}>Email Application</button>

        </>
    );

    const sendApplicationByEmail = async (application) => {
        const db = getFirestore(app);
        const notificationRef = doc(collection(db, 'mail'));

        // Convert application details into a string for the email content
        let emailContent = '';
        for (let [key, value] of Object.entries(application)) {
            if (key !== "id") {
                emailContent += `<strong>${key}:</strong> ${value}<br>`;
            }
        }

        await setDoc(notificationRef, {
            to: 'c.r.zambito@gmail.com', // Use the email of the logged-in user here
            message: {
                subject: `Application Details for ${application.email}`,
                text: 'See application details below:',
                html: emailContent,
            }
        });
    };

    return (
        <div className="flex space-x-6">
            <div className="w-1/3">
                <h2 className="text-xl font-bold mb-4">Pending Applications</h2>
                {applications.filter(app => app.status === 'pending').map(application => (
                    <div key={application.id} onClick={() => setSelectedApplication(application)} className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded">
                        {application.email}
                    </div>
                ))}
                <h2 className="text-xl font-bold mb-4 mt-8">Approved Applications</h2>
                {applications.filter(app => app.status === 'accepted').map(application => (
                    <div key={application.id} onClick={() => setSelectedApplication(application)} className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded">
                        {application.email}
                    </div>
                ))}
                <h2 className="text-xl font-bold mb-4 mt-8">Denied Applications</h2>
                {applications.filter(app => app.status === 'denied').map(application => (
                    <div key={application.id} onClick={() => setSelectedApplication(application)} className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded">
                        {application.email}
                    </div>
                ))}
            </div>
            <div className="w-2/3 p-6 bg-white rounded shadow-lg">
                {selectedApplication ? renderDetails(selectedApplication) : <p>Select an application to view details.</p>}
            </div>
            {renderModal()}
        </div>
    );
};

export default AdminViewApplications;
