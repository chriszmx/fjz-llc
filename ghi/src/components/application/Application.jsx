import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../../Firebase";
import Login from "../../components/login/Login";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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
        <div className="bg-gray-100 min-h-screen p-8 dark:bg-gray-900">
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
            isOpen: false,
            fields: [
                { name: "ID Proof", type: "file", required: true }
            ]
        },

        {
            title: 'Proof of Income 1',
            description: 'Please upload your Proof of Income (1) for verification purposes.',
            isOpen: false,
            fields: [
                { name: "Proof Income 1", type: "file", required: true }
            ]
        },

        {
            title: 'Proof of Income 2',
            description: 'Please upload your Proof of Income (2) for verification purposes.',
            isOpen: false,
            fields: [
                { name: "Proof Income 2", type: "file", required: true }
            ]
        }

    ]);

    const [formData, setFormData] = useState({});

    const handleInputChange = (name, value, e) => {
        if (e.target.type === "file") {
            const file = e.target.files[0];
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



    const handleFormSubmit = async (event) => {
        event.preventDefault();

    // Validate form data before submitting
    const requiredFields = ["Full Name", "Date of Birth", "Phone Number", "ID Proof", "Proof Income 1", "Proof Income 2"];
    for (let field of requiredFields) {
        if (!formData[field]) {
            alert(`Please provide ${field}`);
            return;
        }
    }

        try {
            const db = getFirestore(app);
            const storage = getStorage(app);

            // Iterate over formData and upload if the value is a File
            for (const [key, value] of Object.entries(formData)) {
                if (value instanceof File) {
                    console.log("Uploading file for key:", key);
                    const storageRef = ref(storage, 'applications/' + value.name);
                    const uploadTask = uploadBytesResumable(storageRef, value);

                    // Wait for the upload to complete
                    await new Promise((resolve, reject) => {
                        uploadTask.on('state_changed',
                            (snapshot) => {},
                            (error) => {
                                reject(error);
                            },
                            async () => {
                                const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                                formData[key] = imageUrl;
                                resolve();
                            }
                        );
                    });
                }
            }

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
        <form onSubmit={handleFormSubmit}>
            {sections.map((section, index) => (
                <div key={index} className="mb-6 border dark:border-gray-700 p-4 rounded-md shadow-sm bg-white dark:bg-gray-800">
                    <button
                        onClick={() => toggleSection(index)}
                        className="flex justify-between items-center w-full bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-4 py-2 rounded-md focus:outline-none"
                    >
                        <span>{section.title}</span>
                        <span>{section.isOpen ? '−' : '+'}</span>
                    </button>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">{section.description}</p>
                    {section.isOpen && (
                        <div className="mt-4 space-y-4">
                            {section.fields.map(field => (
                                <InputField
                                    key={field.name}
                                    field={field}
                                    value={formData[field.name] || ""}
                                    onChange={e => handleInputChange(field.name, e.target.value, e)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ))}
            <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
                Submit
            </button>
        </form>
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
                    className="border dark:border-gray-600 w-full p-2 rounded-md dark:bg-gray-700 dark:text-gray-300"
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
