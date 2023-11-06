import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import { app } from '../../Firebase';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';


function AIAppEvaluation() {
    const [applicants, setApplicants] = useState([]);
    const [evaluatingApplicantId, setEvaluatingApplicantId] = useState(null);



    useEffect(() => {
        const fetchApplicants = async () => {
            const db = getFirestore(app);
            const applicantsCollection = await getDocs(collection(db, 'application'));
            const fetchedApplicants = applicantsCollection.docs.map(doc => ({
                uid: doc.id,
                ...doc.data()
            }));
            setApplicants(fetchedApplicants);
        };

        fetchApplicants();
    }, []);


    const handleEvaluateClick = (applicantData) => {
        setEvaluatingApplicantId(applicantData.uid);

        axios.post('https://us-central1-fjz-llc.cloudfunctions.net/evaluateTenant', {
            applicantData: applicantData
        })
            .then(response => {
                const updatedApplicants = applicants.map(applicant => {
                    if (applicant.uid === applicantData.uid) {
                        return {
                            ...applicant,
                            evaluation: response.data.evaluation
                        };
                    }
                    return applicant;
                });
                setApplicants(updatedApplicants);

                setEvaluatingApplicantId(null);
            })
            .catch(error => {
                console.error("Error evaluating tenant:", error);
            });
    };

    const handleSaveClick = async (applicant) => {
        // Make sure there's an evaluation to save
        if (!applicant.evaluation) {
            console.error("No evaluation to save.");
            return;
        }

        const db = getFirestore(app);
        const docRef = doc(db, 'application', applicant.uid);

        try {
            // Log the reference to make sure it's correct
            console.log("Document reference:", docRef);

            // Attempt to merge the savedEvaluation into the document
            await updateDoc(docRef, {
                savedEvaluation: applicant.evaluation
            }, { merge: true });

            console.log("Successfully updated evaluation for:", applicant.uid);
            // Update local state
            setApplicants(applicants.map(app => {
                if (app.uid === applicant.uid) {
                    return {
                        ...app,
                        savedEvaluation: applicant.evaluation
                    };
                }
                return app;
            }));
        } catch (error) {
            // Log the full error
            console.error("Error updating evaluation:", error);
        }
    };







    return (
        <div className='bg-gray-800 min-h-screen text-white'>
            {applicants.map((applicant) => (
                <div key={applicant.uid} className="max-w-xl mx-auto bg-gray-700 rounded-xl shadow-md overflow-hidden my-5 p-4">
                    <div className="p-4">
                        <h3 className="text-xl font-semibold text-white">{`${applicant['First Name']} ${applicant['Last Name']}`}</h3>
                        <button
                            onClick={() => handleEvaluateClick(applicant)}
                            className="mt-3 px-5 py-2 bg-blue-600 hover:bg-blue-800 text-white font-bold rounded-lg transition duration-300 ease-in-out flex items-center"
                            disabled={evaluatingApplicantId === applicant.uid}
                        >
                            {evaluatingApplicantId === applicant.uid ? (
                                <BeatLoader size={8} color={"#fff"} />
                            ) : (
                                'Generate AI Evaluation'
                            )}
                        </button>

                        {applicant.evaluation && <p className="mt-3 text-gray-300">{applicant.evaluation}</p>}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AIAppEvaluation;


{/* <button
    disabled={!applicant.evaluation}
    onClick={() => handleSaveClick(applicant)}

>
    Save Evaluation
</button>
{applicant.savedEvaluation &&
    <div>
        <strong>Saved Evaluation:</strong>
        <p>{applicant.savedEvaluation}</p>
    </div>
} */}
