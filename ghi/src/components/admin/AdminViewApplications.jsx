import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { app } from "../../Firebase";
// import { getAuth, deleteUser } from "firebase/auth";
// import { getStorage } from "firebase/storage";



const AdminViewApplications = () => {
    const [applications, setApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState(null);

    const handleApplicationClick = (application) => {
        setSelectedApplication(application);
    };

    const selectedStyle = {
        // backgroundColor: '#e2e8f0',
        borderColor: '#bfdbfe',
        borderLeft: '8px solid #00c4ff',
    };

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

    const acceptanceEmailHTML = `
<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <p>Thank you for submitting your rental application to FJZ Apartments. We are excited to inform you that your application has been accepted!</p>
    <p>Please expect an email or text message within the next 24 hours detailing the next steps in the leasing process.</p>
    <p>Congratulations, and welcome to the FJZ Apartments community!</p>
    <br>
    <p>Best regards,</p>
    <p>FJZ Apartments Team</p>
</div>
`;

    const rejectionEmailHTML = `
<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <p>Thank you for your interest in FJZ Apartments and for submitting your rental application.</p>
    <p>After careful review, we regret to inform you that the apartment is currently no longer available. We appreciate your understanding and encourage you to keep an eye out for future availabilities.</p>
    <p>Thank you for considering FJZ Apartments. We wish you all the best in your housing search.</p>
    <br>
    <p>Best regards,</p>
    <p>FJZ Apartments Team</p>
</div>
`;


    const handleDeleteAndSendEmail = async (appId, email) => {
        const db = getFirestore(app);

        // Create a notification document
        const notificationRef = doc(collection(db, 'mail'));
        await setDoc(notificationRef, {
            to: email,
            message: {
                subject: 'Update on Your Apartment Application',
                text: 'We appreciate your interest in FJZ Apartments.',
                html: `${rejectionEmailHTML}<br><br><p>**This is an automated email. Please do not reply.**</p>`
            }
        });

        // Delete the application
        await handleDelete(appId);
    };

    const handleDeleteAndSendEmailAndUpdateRole = async (appId, email, uid) => {
        const db = getFirestore(app);

        // Create a notification document
        const notificationRef = doc(collection(db, 'mail'));
        await setDoc(notificationRef, {
            to: email,
            message: {
                subject: 'Update on Your Apartment Application',
                text: 'We appreciate your interest in FJZ Apartments.',
                html: `${rejectionEmailHTML}<br><br><p>**This is an automated email. Please do not reply.**</p>`
            }
        });

        // Delete the application
        await handleDelete(appId);

        // Update the user's role to 'rejected'
        console.log(uid);
        const userRef = doc(db, 'users', uid); // Use UID as the document ID
        await updateDoc(userRef, {
            role: 'X' // 'X' is the role for rejected users
        }).catch((error) => {
            console.error("Error updating user's role: ", error);
        });
    };




    const handleAcceptAndSendEmail = async (email) => {
        console.log("Trying to send acceptance email to:", email);
        const db = getFirestore(app);
        const notificationRef = doc(collection(db, 'mail'));
        await setDoc(notificationRef, {
            to: email,
            message: {
                subject: 'Congratulations on Your Apartment Application!',
                text: 'Your rental application has been accepted!',
                html: `${acceptanceEmailHTML}<br><br><p>**This is an automated email. Please do not reply.**</p>`,
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
                case 'deleteAndSendEmailAndUpdateRole':
                    handleDeleteAndSendEmailAndUpdateRole(selectedApplication.id, selectedApplication.email, selectedApplication.uid);
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
            accept: '**SAFE** Confirm application acceptance? THIS WILL NOT NOTIFY APPLICANT.',
            sendAcceptanceEmail: '**EMAIL WARNING** Confirm sending acceptance email?',
            deny: '**SAFE** Confirm application denial? THIS WILL NOT NOTIFY APPLICANT.',
            delete: '**DELETE WARNING** Confirm application deletion? WILL NOT NOTIFY APPLICANT. This Will Delete ALL Photos/Data Associated With This Application.',
            deleteAndSendEmail: '**EMAIL WARNING** Confirm application deletion and sending of email? This Will Remove All Data Associated With This Application.',
            deleteAndSendEmailAndUpdateRole: '**EMAIL WARNING** Confirm application deletion and sending of email? This Will Remove All Data Associated With This Application. This will also automatically delete the user in 24 hours.',
            sendApplicationByEmail: '**SAFE** Confirm sending of application details email to FJZ?',
        };

        return (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded shadow-md">
                    <p>{message[actionType]}</p>
                    <div className="flex justify-end mt-4">
                        <button className="bg-green-500 m-2 p-2 text-white rounded-lg hover:bg-green-900" onClick={executeAction}>Confirm</button>
                        <button className="bg-red-500 m-2 p-2 text-white rounded-lg hover:bg-red-900" onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    };

    const orderList = [
        "ID Proof",
        "First Name",
        "Middle Initial",
        "Last Name",
        "Email",
        "Phone Number",
        "Date of Birth (DOB)",
        "Marital Status",
        "Apartment Address",
        "Apartment Number",
        "Last 4 of SSN",
        "Driver License Number",
        "Present Home Address",
        "Apartment/Location Apt#",
        "Length of Time at Address",
        "Landlord Phone",
        "Amount of Rent",
        "Reason for Leaving",
        "Is your present rent up to date?",
        "Have you ever been locked out of your apartment by the sheriff?",
        "Have you ever been brought to court by another landlord?",
        "Have you ever moved owing rent or damaged an apartment?",
        "Number of occupants",
        "Details of each occupant (Name, Age, Occupation).",
        "Do you have pets? How many & type.",
        "Number of vehicles",
        "Details of each vehicle (Make, Model, Color, Plate, Year).",
        "Employment Status",
        "Current Employer",
        "Occupation",
        "Hours per Week",
        "Supervisor Name",
        "Current Income/Amount",
        "Current Car Debt",
        "Current Credit Card Debt",
        "Is the total move-in amount available now?",
        "Emergency Contact (Name, Phone, Relationship)",
        "Personal Reference (Name, Phone, Relationship)",
        "Have you ever been sued for bills?",
        "Have you ever filed for bankruptcy?",
        "Have you ever been found guilty of a felony?",
        "Have you ever been evicted?",
        "Have you ever broken a lease?",
        "Proof Income 1",
        "Proof Income 2",
        "Sign Here",
        "Today's Date",
    ];


    const renderDetails = application => (
        <>
            <div className="container mx-auto mt-8 p-4 md:p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                {orderList.map((key, index) => {
                    const value = application[key];
                    if (value && value !== "") {
                        return (
                            <div key={index} className="mb-4 last:mb-0 p-4 bg-gray-100 dark:bg-gray-900 rounded-md">
                                <h4 className="mb-2 font-semibold text-lg dark:text-gray-300">{key}:</h4>
                                {["ID Proof", "Proof Income 1", "Proof Income 2"].includes(key) && value.startsWith("https://firebasestorage.googleapis.com/") ? (
                                    <img src={value} alt="Application related" className="max-w-xs mx-auto shadow-md rounded" />
                                ) : (
                                    <p className="text-gray-700 dark:text-gray-400">{value}</p>
                                )}
                            </div>
                        );
                    }
                    return null;
                })}
            </div>


            {/* <button className="bg-green-500 m-2 p-2 text-white rounded-lg" onClick={() => openModal('accept')}>Move to Accept</button>
            <button className="bg-red-500 m-2 p-2 text-white rounded-lg" onClick={() => openModal('deny')}>Move to Deny</button>
            <button className="bg-red-600 m-2 p-2 text-white rounded-lg" onClick={() => openModal('delete')}>*DELETE*</button>
            <br />
            <button className="bg-green-700 m-2 p-2 text-white rounded-lg" onClick={() => openModal('sendAcceptanceEmail')}>Send Acceptance Email to Applicant</button>
            <br />
            <button className="bg-red-900 m-2 p-2 text-white rounded-lg" onClick={() => openModal('deleteAndSendEmail')}>*Delete* and Send Rejection Email</button>
            <br />
            <button className="bg-blue-500 m-2 p-2 text-white rounded-lg" onClick={() => openModal('sendApplicationByEmail')}>Email Application to Self</button> */}

            <div className="space-y-4 pt-10">
                {/* Status change buttons */}

                <p>Applications Actions</p>

                <div className="flex items-center space-x-4">
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => openModal('accept')}>
                        Approve Application
                    </button>
                    <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded" onClick={() => openModal('deny')}>
                        Reject Application
                    </button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => openModal('delete')}>
                        Delete Application
                    </button>
                </div>

                <div className="space-y-4 pt-10">
                    <p>Communication Actions</p>
                    <div className="flex items-center space-x-4">
                        <button className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded" onClick={() => openModal('sendAcceptanceEmail')}>
                            Send Acceptance Email
                        </button>
                    </div>

                    <p>Rejection Actions (Deletes User)</p>
                    <div className="flex items-center space-x-4">
                        <button className="bg-yellow-600 hover:bg-yellow-800 text-white font-bold py-2 px-4 rounded" onClick={() => openModal('deleteAndSendEmail')}>
                            Reject & Schedule Deletion (90 Days)
                        </button>

                        <button className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded" onClick={() => openModal('deleteAndSendEmailAndUpdateRole')}>
                            Reject & Immediate Deletion (24 Hours)
                        </button>
                    </div>

                    <p>Personal Tools</p>
                    <div className="flex items-center space-x-4">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => openModal('sendApplicationByEmail')}>
                            Email Application to Me
                        </button>
                    </div>
                </div>

            </div>
        </>
    );

    const sendApplicationByEmail = async (application) => {
        const db = getFirestore(app);
        const notificationRef = doc(collection(db, 'mail'));

        // Convert application details into a string for the email content using the orderList
        let emailContent = '<table style="width: 100%; border-collapse: collapse;">';

        orderList.forEach(key => {
            const value = application[key];
            if (value && value !== "") {
                emailContent += `
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 8px; text-align: left; font-weight: bold;">${key}:</td>
                    <td style="padding: 8px; text-align: left;">
                        ${["ID Proof", "Proof Income 1", "Proof Income 2"].includes(key) && value.startsWith("https://firebasestorage.googleapis.com/") ?
                        `<img src="${value}" alt="Application related" style="max-width: 200px;">` :
                        `${value}`}
                    </td>
                </tr>`;
            }
        });

        emailContent += '</table>';

        await setDoc(notificationRef, {
            to: ['c.r.zambito@gmail.com', 'fjzllc@gmail.com', 'bz814@aol.com'],
            message: {
                subject: `Application Details for ${application.email}`,
                text: 'See application details below:',
                html: emailContent,
            }
        });
    };


    return (
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
            <div className="w-full md:w-1/3">
                <h2 className="text-xl font-bold mb-4">Pending Applications</h2>
                {applications.filter(app => app.status === 'pending').map(application => (
                    <div
                        key={application.id}
                        onClick={() => handleApplicationClick(application)}
                        style={selectedApplication && selectedApplication.id === application.id ? selectedStyle : {}}
                        className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 p-2 sm:p-1 rounded mb-4 sm:mb-3 grid sm:grid-cols-1 md:grid-cols-2 gap-3 sm:gap-2 border border-gray-200 dark:border-gray-800"
                    >
                        {application["First Name"] && application["Last Name"] ? (
                            <>
                                <span className="block dark:text-gray-200 text-xl">{`${application["First Name"]} ${application["Last Name"]}`}</span>
                                <span className="block dark:text-gray-400 text-lg">{`${application['Apartment Address']} # ${application['Apartment Number']}`}</span>
                                <span className="block dark:text-gray-400 text-lg">{application["Today's Date"]}</span>
                                {/* <span className="block dark:text-indigo-300 text-lg">{`Apt No: ${application['Apartment Number']}`}</span> */}
                                <span className="block dark:text-gray-500 text-lg">{`${application['Occupation']}`}</span>
                                <span className="block dark:text-green-500 text-lg">{`$${application['Current Income/Amount']}`}</span>
                            </>
                        ) : (
                            <span className="block">{application.email}</span>
                        )}
                    </div>

                ))}
                <h2 className="text-xl font-bold mb-4 mt-8">Approved Applications</h2>
                {applications.filter(app => app.status === 'accepted').map(application => (
                    <div
                        key={application.id}
                        onClick={() => setSelectedApplication(application)}
                        className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded mb-4"
                    >
                        {application["First Name"] && application["Last Name"] ? (
                            <>
                                <span className="block">{`${application["First Name"]} ${application["Last Name"]}`}</span>
                                <span className="block">{application['Apartment Address']}</span>
                                <span className="block">{`Apt No: ${application['Apartment Number']}`}</span>
                                <span className="block">{application["Today's Date"]}</span>
                            </>
                        ) : (
                            <span className="block">{application.email}</span>
                        )}
                    </div>

                ))}
                <h2 className="text-xl font-bold mb-4 mt-8">Denied Applications</h2>
                {applications.filter(app => app.status === 'denied').map(application => (
                    <div
                        key={application.id}
                        onClick={() => setSelectedApplication(application)}
                        className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded mb-4"
                    >
                        {application["First Name"] && application["Last Name"] ? (
                            <>
                                <span className="block">{`${application["First Name"]} ${application["Last Name"]}`}</span>
                                <span className="block">{application['Apartment Address']}</span>
                                <span className="block">{`Apt No: ${application['Apartment Number']}`}</span>
                                <span className="block">{application["Today's Date"]}</span>
                            </>
                        ) : (
                            <span className="block">{application.email}</span>
                        )}
                    </div>

                ))}
            </div>
            <div className="w-full md:w-2/3 p-6 bg-white rounded shadow-lg">
                {selectedApplication ? renderDetails(selectedApplication) : <p>Select an application to view details.</p>}
            </div>
            {renderModal()}
        </div>
    );

};

export default AdminViewApplications;
