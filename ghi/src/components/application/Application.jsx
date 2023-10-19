import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../../Firebase";
import Login from "../../components/login/Login";

const Application = () => {
    const [user, setUser] = useState(null);
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, [auth]);

    if (!user) {
        return <Login />;
    }

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <h1 className="text-2xl font-bold mb-8">Application Form</h1>
            <FormTemplate user={user} />
        </div>
    );
};

const FormTemplate = ({ user }) => {
    const [sections, setSections] = useState([
        {
            title: 'Personal Information',
            description: 'Tell us a bit about yourself.',
            isOpen: true,
            fields: [
                { name: "Full Name", type: "text", required: true },
                { name: "Date of Birth", type: "date", required: true },
                { name: "Phone Number", type: "tel", required: true }
            ]
        },

        {
            title: 'Identity Verification',
            description: 'Please upload your identification for verification purposes.',
            isOpen: true,
            fields: [
                { name: "ID Proof", type: "file", required: true }
            ]
        }

    ]);

    const [formData, setFormData] = useState({});

    const handleInputChange = (name, value) => {
        if (name === "ID Proof") {
            const file = value.files[0];
            // You can set the file object to your state, or
            // if you want to directly upload it to a server, you can handle it here.
            setFormData(prev => ({
                ...prev,
                [name]: file
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };


    const handleFormSubmit = async () => {
        try {
            const db = getFirestore(app);
            await addDoc(collection(db, "application"), {
                uid: user.uid,
                email: user.email,
                status: "pending",
                ...formData
            });
            alert('Form submitted successfully!');
        } catch (error) {
            console.error("Error submitting form: ", error);
            alert('There was an issue submitting the form.');
        }
    };

    const toggleSection = (index) => {
        const updatedSections = sections.map((section, idx) => {
            if (idx === index) {
                return { ...section, isOpen: !section.isOpen };
            }
            return section;
        });
        setSections(updatedSections);
    };

    return (
        <div>
            {sections.map((section, index) => (
                <div key={index} className="mb-6 border p-4 rounded-md shadow-sm">
                    <button
                        onClick={() => toggleSection(index)}
                        className="flex justify-between items-center w-full bg-indigo-500 text-white px-4 py-2 rounded-md focus:outline-none"
                    >
                        <span>{section.title}</span>
                        <span>{section.isOpen ? '−' : '+'}</span>
                    </button>
                    <p className="mt-2 text-gray-600">{section.description}</p>
                    {section.isOpen && (
                        <div className="mt-4 space-y-4">
                            {section.fields.map(field => (
                                <InputField
                                    key={field.name}
                                    field={field}
                                    value={formData[field.name] || ""}
                                    onChange={e => handleInputChange(field.name, e.target.value)}
                                />
                            ))}

                        </div>
                    )}
                </div>
            ))}
            <button onClick={handleFormSubmit} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">Submit</button>
        </div>
    );
};

const InputField = ({ field, value, onChange }) => {
    return (
        <div className="mb-4">
            {field.type === "file" ? (
                <input
                    type={field.type}
                    required={field.required}
                    onChange={onChange}
                />
            ) : (
                <input
                    className="border w-full p-2 rounded-md"
                    placeholder={field.name}
                    type={field.type}
                    required={field.required}
                    value={value}
                    onChange={onChange}
                />
            )}
        </div>
    );
};




export default Application;
















// import React, { useState, useEffect } from "react";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { getFirestore, collection, addDoc } from "firebase/firestore";
// import { app } from "../../Firebase";
// import Login from "../../components/login/Login";
// import { getStorage, ref, uploadBytes } from "firebase/storage";


// const Application = () => {
//     const [user, setUser] = useState(null);
//     const auth = getAuth(app);

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//             setUser(currentUser);
//         });

//         return () => unsubscribe();
//     }, [auth]);

//     if (!user) {
//         return <Login />;
//     }

//     return (
//         <div className="bg-gray-100 min-h-screen p-8">
//             <h1 className="text-2xl font-bold mb-8">Application Form</h1>
//             <FormTemplate user={user} />
//         </div>
//     );
// };

// const FormTemplate = ({ user }) => {
//     const [sections, setSections] = useState([
//         {
//             title: 'Personal Information',
//             description: 'Tell us a bit about yourself.',
//             isOpen: true,
//             fields: [
//                 { name: "Full Name", type: "text", required: true },
//                 { name: "Date of Birth", type: "date", required: true },
//                 { name: "Phone Number", type: "tel", required: true }
//             ]
//         },
//         {
//             title: 'Identity Verification',
//             description: 'Please upload your identification for verification purposes.',
//             isOpen: true,
//             fields: [
//                 { name: "ID Proof", type: "file", required: true }
//             ]
//         }

//     ]);

//     const [formData, setFormData] = useState({});

//     const handleInputChange = (name, event) => {
//         if (name === "ID Proof") {
//             const file = event.target.files[0];
//             setFormData(prev => ({
//                 ...prev,
//                 [name]: file
//             }));
//         } else {
//             setFormData(prev => ({
//                 ...prev,
//                 [name]: event.target.value
//             }));
//         }
//     };



//     const handleFormSubmit = async () => {
//         try {
//             const db = getFirestore(app);
//             const storage = getStorage(app);

//             // If there's a file to upload (ID Proof)
//             if (formData["ID Proof"]) {
//                 const storageRef = ref(storage, `idProofs/${user.uid}`);
//                 await uploadBytes(storageRef, formData["ID Proof"]);

//                 // You might also want to store the download URL, so you can retrieve the file later.
//                 const downloadURL = await getDownloadURL(storageRef);

//                 // Include the URL in the form data
//                 formData["ID Proof URL"] = downloadURL;
//             }

//             await addDoc(collection(db, "application"), {
//                 uid: user.uid,
//                 email: user.email,
//                 status: "pending",
//                 ...formData
//             });

//             alert('Form submitted successfully!');
//         } catch (error) {
//             console.error("Error submitting form: ", error);
//             alert('There was an issue submitting the form.');
//         }
//     };


//     const toggleSection = (index) => {
//         const updatedSections = sections.map((section, idx) => {
//             if (idx === index) {
//                 return { ...section, isOpen: !section.isOpen };
//             }
//             return section;
//         });
//         setSections(updatedSections);
//     };

//     return (
//         <div>
//             {sections.map((section, index) => (
//                 <div key={index} className="mb-6 border p-4 rounded-md shadow-sm">
//                     <button
//                         onClick={() => toggleSection(index)}
//                         className="flex justify-between items-center w-full bg-indigo-500 text-white px-4 py-2 rounded-md focus:outline-none"
//                     >
//                         <span>{section.title}</span>
//                         <span>{section.isOpen ? '−' : '+'}</span>
//                     </button>
//                     <p className="mt-2 text-gray-600">{section.description}</p>
//                     {section.isOpen && (
//                         <div className="mt-4 space-y-4">
//                             {section.fields.map(field => (
//                                 <InputField
//                                     key={field.name}
//                                     field={field}
//                                     value={formData[field.name] || ""}
//                                     onChange={e => handleInputChange(field.name, e)}
//                                 />
//                             ))}

//                         </div>
//                     )}
//                 </div>
//             ))}
//             <button onClick={handleFormSubmit} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">Submit</button>
//         </div>
//     );
// };

// const InputField = ({ field, value, onChange }) => {
//     return (
//         <div className="mb-4">
//             {field.type === "file" ? (
//                 <input
//                     type={field.type}
//                     required={field.required}
//                     onChange={onChange}
//                 />
//             ) : (
//                 <input
//                     className="border w-full p-2 rounded-md"
//                     placeholder={field.name}
//                     type={field.type}
//                     required={field.required}
//                     value={value}
//                     onChange={e => onChange(field.name, e)}
//                 />
//             )}
//         </div>
//     );
// };

// export default Application;
