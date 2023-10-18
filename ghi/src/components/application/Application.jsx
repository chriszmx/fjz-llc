import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../../Firebase";
import Login from "../../components/login/Login"; // Ensure the correct path to your Login component

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
        { title: 'Section 1', isOpen: false, fields: ["Example Field 1", "Example Field 2"] },
        // Add more sections as required
    ]);

    const [formData, setFormData] = useState({});

    const handleInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
                <div key={index} className="mb-4">
                    <button onClick={() => toggleSection(index)} className="bg-indigo-500 text-white px-4 py-2 rounded-md">
                        {section.title}
                    </button>
                    {section.isOpen && (
                        <div className="mt-4">
                            {section.fields.map(field => (
                                <InputField
                                    key={field}
                                    placeholder={field}
                                    value={formData[field] || ""}
                                    onChange={e => handleInputChange(field, e.target.value)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ))}
            <button onClick={handleFormSubmit} className="bg-green-500 text-white px-4 py-2 rounded-md">Submit</button>
        </div>
    );
};

const InputField = ({ placeholder, value, onChange }) => {
    return (
        <div className="mb-4">
            <input
                className="border w-full p-2 rounded-md"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default Application;
