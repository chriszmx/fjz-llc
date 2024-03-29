import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
	getFirestore,
	collection,
	addDoc,
	doc,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { app } from "../../Firebase";
import Login from "../../components/login/Login";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";

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
			title: "Personal Information",
			description: "Tell us a bit about yourself.",
			isOpen: true,
			fields: [
				{ name: "First Name", type: "text", required: true },
				{ name: "Middle Initial", type: "text", required: false },
				{ name: "Last Name", type: "text", required: true },
				{ name: "Email", type: "email", required: true },
				{ name: "Phone Number", type: "tel", required: true },
				{ name: "Date of Birth (DOB)", type: "text", required: true },
				{
					name: "Marital Status",
					type: "dropdown",
					required: false,
					options: ["Married", "Divorced", "single"],
				},
			],
		},

		{
			title: "Apartment Information",
			description: "Verify the apartment you are applying for.",
			isOpen: true,
			fields: [
				{ name: "Apartment Address", type: "text", required: true },
				{ name: "Apartment Number", type: "text", required: true },
			],
		},

		{
			title: "Identification",
			description: "Verify your identity.",
			isOpen: true,
			fields: [
				{ name: "Last 4 of SSN", type: "text", required: true },
				{
					name: "Driver License Number",
					type: "text",
					required: true,
				},
			],
		},

		{
			title: "Current Residence Details",
			description: "Current residence details.",
			isOpen: true,
			fields: [
				{ name: "Present Home Address", type: "text", required: true },
				{
					name: "Apartment/Location Apt#",
					type: "text",
					required: false,
				},
				{
					name: "Length of Time at Address",
					type: "text",
					required: false,
				},
				{ name: "Landlord Phone", type: "tel", required: false },
				{ name: "Amount of Rent", type: "number", required: true },
				{ name: "Reason for Leaving", type: "text", required: true },
				{
					name: "Is your present rent up to date?",
					type: "text",
					required: true,
				},
				{
					name: "Have you ever been locked out of your apartment by the sheriff?",
					type: "text",
					required: true,
				},
				{
					name: "Have you ever been brought to court by another landlord?",
					type: "text",
					required: true,
				},
				{
					name: "Have you ever moved owing rent or damaged an apartment?",
					type: "text",
					required: true,
				},
			],
		},

		{
			title: "Household Information",
			description: "Tell us about your household.",
			isOpen: true,
			fields: [
				{ name: "Number of occupants", type: "text", required: true },
				{
					name: "Details of each occupant (Name, Age, Occupation).",
					type: "text",
					required: true,
				},
				{
					name: "Do you have pets? How many & type.",
					type: "text",
					required: true,
				},
			],
		},

		{
			title: "Vehicle Information",
			description: "Tell us about your vehicle(s).",
			isOpen: true,
			fields: [
				{ name: "Number of vehicles", type: "number", required: true },
				{
					name: "Details of each vehicle (Make, Model, Color, Plate, Year).",
					type: "text",
					required: false,
				},
			],
		},

		{
			title: "Employment & Income",
			description: "Tell us about your employment and income.",
			isOpen: true,
			fields: [
				{ name: "Employment Status", type: "text", required: true },
				{ name: "Current Employer", type: "text", required: true },
				{ name: "Occupation", type: "text", required: true },
				{ name: "Hours per Week", type: "number", required: true },
				{ name: "Supervisor Name", type: "text", required: false },
				{
					name: "Current Income/Amount",
					type: "number",
					required: true,
				},
			],
		},

		{
			title: "Financial Information",
			description: "Tell us about your financial situation.",
			isOpen: true,
			fields: [
				{ name: "Current Car Debt", type: "number", required: true },
				{
					name: "Current Credit Card Debt",
					type: "number",
					required: false,
				},
				{
					name: "Is the total move-in amount available now?",
					type: "text",
					required: true,
				},
				{
					name: "Credit Score",
					type: "number",
					required: true,
				},
			],
		},

		{
			title: "References & History",
			description: "Tell us about your references and history.",
			isOpen: true,
			fields: [
				{
					name: "Emergency Contact (Name, Phone, Relationship)",
					type: "text",
					required: true,
				},
				{
					name: "Personal Reference (Name, Phone, Relationship)",
					type: "text",
					required: false,
				},
				{
					name: "Have you ever been sued for bills?",
					type: "text",
					required: true,
				},
				{
					name: "Have you ever filed for bankruptcy?",
					type: "text",
					required: true,
				},
				{
					name: "Have you ever been found guilty of a felony?",
					type: "text",
					required: true,
				},
				{
					name: "Have you ever been evicted?",
					type: "text",
					required: true,
				},
				{
					name: "Have you ever broken a lease?",
					type: "text",
					required: true,
				},
			],
		},

		{
			title: "Identity Verification",
			description:
				"Please upload your identification for verification purposes.",
			isOpen: true,
			fields: [{ name: "ID Proof", type: "file", required: true }],
		},

		{
			title: "Proof of Income 1",
			description:
				"Please upload your Proof of Income (1) for verification purposes.",
			isOpen: true,
			fields: [{ name: "Proof Income 1", type: "file", required: true }],
		},

		{
			title: "Proof of Income 2",
			description:
				"Please upload your Proof of Income (2) for verification purposes.",
			isOpen: true,
			fields: [{ name: "Proof Income 2", type: "file", required: true }],
		},

		{
			title: "Authorization",
			description:
				"Applicant authorizes the landlord to contact past and present landlords, employers, creditors, credit bureaus, neighbors and any other sources deemed necessary to investigate applicant. All information is true, accurate and complete to the best of applicant's knowledge. Landlord reserves the right to disqualify tenant if information is not as represented. ANY PERSON OR FIRM IS AUTHORIZED TO RELEASE INFORMATION ABOUT THE UNDERSIGNED UPON PRESENTATION OF THIS FORM OR A PHOTOCOPY OF THIS FORM AT ANY TIME.",
			isOpen: true,
			fields: [
				{ name: "Sign Here", type: "text", required: true },
				{
					name: "Today's Date",
					type: "date",
					required: true,
					defaultValue: new Date().toISOString().split("T")[0],
				}, // Auto-populates today's date
			],
		},
	]);

	const [formData, setFormData] = useState({});

	const handleInputChange = (name, value, e) => {
		if (e.target.type === "file") {
			const file = e.target.files[0];
			setFormData((prev) => ({
				...prev,
				[name]: file,
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const sendApplicationByEmail = async (application) => {
		const db = getFirestore(app);

		const excludedFields = ["id"];

		// Convert application details into a table string for the email content
		let emailContent =
			'<table style="width: 100%; border-collapse: collapse;">';

		Object.entries(application).forEach(([key, value]) => {
			if (!excludedFields.includes(key) && value && value !== "") {
				if (
					["ID Proof", "Proof Income 1", "Proof Income 2"].includes(
						key
					) &&
					value.startsWith("https://firebasestorage.googleapis.com/")
				) {
					emailContent += `
            <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 8px; text-align: left; font-weight: bold;">${key}:</td>
                <td style="padding: 8px; text-align: left;">
                    <img src="${value}" alt="${key}" style="max-width: 200px;">
                </td>
            </tr>`;
				} else {
					emailContent += `
            <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 8px; text-align: left; font-weight: bold;">${key}:</td>
                <td style="padding: 8px; text-align: left;">${value}</td>
            </tr>`;
				}
			}
		});

		emailContent += "</table>";

		try {
			// Email to the administrators
			await setDoc(doc(collection(db, "mail")), {
				to: [
					"c.r.zambito@gmail.com",
					"fjzllc@gmail.com",
					"bz814@aol.com",
					"wilkin.ruizvalerio@gmail.com",
				],
				message: {
					subject: `Application Details for ${application.email}`,
					text: "See application details below:",
					html: emailContent,
				},
			});

			// Confirmation email to the applicant with their application details
			await setDoc(doc(collection(db, "mail")), {
				to: [application.email],
				message: {
					subject: "Your Rental Application Submission",
					text: "Thank you for submitting your rental application. Below are the details you provided:",
					html: `<p>Thank you, <strong>${application["First Name"]} ${application["Last Name"]}</strong>, for submitting your rental application to FJZ Apartments.</p><p>Below are the details you provided:</p>${emailContent}<p>Please keep an eye out for updates on the status of your application.</p><p>Best regards,<br>FJZ Apartments Team</p>`,
				},
			});
		} catch (error) {
			console.error("Error sending application by email: ", error);
			throw new Error("There was an issue sending the email.");
		}
	};

	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleFormSubmit = async (event) => {
		event.preventDefault();
		setIsSubmitting(true);

		try {
			// Validate form data before submitting
			const requiredFields = [
				"First Name",
				"Last Name",
				"Email",
				"Phone Number",
				"Date of Birth (DOB)",
				"Apartment Address",
				"Apartment Number",
				"Amount of Rent",
				"Number of occupants",
				"Do you have pets? How many & type.",
				"Employment Status",
				"Current Employer",
				"Occupation",
				"Hours per Week",
				"Current Income/Amount",
				"Is the total move-in amount available now?",
				"Have you ever been sued for bills?",
				"Have you ever filed for bankruptcy?",
				"Have you ever been found guilty of a felony?",
				"Have you ever been evicted?",
				"Have you ever broken a lease?",
				"Sign Here",
				"Today's Date",
				"Credit Score",
			];
			for (let field of requiredFields) {
				if (!formData[field]) {
					alert(`Please provide ${field}`);
					setIsSubmitting(false);
					return;
				}
			}

			const db = getFirestore(app);
			const storage = getStorage(app);

			// Generate a unique filename using current timestamp and a random string
			const generateUniqueFilename = (originalName) => {
				const extension = originalName.split(".").pop();
				const timestamp = Date.now();
				const randomString = Math.random()
					.toString(36)
					.substring(2, 15);
				return `${timestamp}_${randomString}.${extension}`;
			};

			// Iterate over formData and upload if the value is a File
			for (const [key, value] of Object.entries(formData)) {
				if (value instanceof File) {
					console.log("Uploading file for key:", key);
					const uniqueName = generateUniqueFilename(value.name);
					const storageRef = ref(
						storage,
						"applications/" + uniqueName
					);
					const uploadTask = uploadBytesResumable(storageRef, value);

					// Wait for the upload to complete
					await new Promise((resolve, reject) => {
						uploadTask.on(
							"state_changed",
							(snapshot) => {},
							(error) => {
								reject(error);
							},
							async () => {
								const imageUrl = await getDownloadURL(
									uploadTask.snapshot.ref
								);
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
				...formData,
			});

			// Update user profile data in the 'users' collection
			const userRef = doc(db, "users", user.uid);
			const updateData = {
				firstName: formData["First Name"],
				lastName: formData["Last Name"],
				phoneNumber: formData["Phone Number"],
			};
			await updateDoc(userRef, updateData);

			try {
				await sendApplicationByEmail({
					...formData,
					uid: user.uid,
					email: user.email,
					status: "pending",
				});
				alert(
					"Form submitted successfully! Please check your email for status updates on your rental application from noreply@fjzapartments.com, also check your spam folder."
				);
				setFormData({});
			} catch (emailError) {
				console.error(
					"Error sending application by email: ",
					emailError
				);
				alert(
					"Form was submitted, but there was an issue sending the confirmation email."
				);
			}
		} catch (error) {
			console.error("Error submitting form: ", error);
			alert("There was an issue submitting the form.");
		} finally {
			setIsSubmitting(false);
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
			{/* Overlay message during form submission */}
			{isSubmitting && (
				<div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 bg-black z-50">
					<div className="bg-white p-6 rounded shadow-md text-xl">
						Form updating... Please do not navigate away. This may
						take a few minutes. A confirmation will appear when
						submission has been successful. Thank you!
					</div>
				</div>
			)}
			<form onSubmit={handleFormSubmit}>
				{sections.map((section, index) => (
					<div
						key={index}
						className="mb-6 border dark:border-gray-700 p-4 rounded-md shadow-sm bg-white dark:bg-gray-800"
					>
						<button
							onClick={() => toggleSection(index)}
							className="flex justify-between items-center w-full bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-4 py-2 rounded-md focus:outline-none"
						>
							<span>{section.title}</span>
							<span>{section.isOpen ? "−" : "+"}</span>
						</button>
						<p className="mt-2 text-gray-600 dark:text-gray-300">
							{section.description}
						</p>
						{section.isOpen && (
							<div className="mt-4 space-y-4">
								{section.fields.map((field) => (
									<div key={field.name}>
										{/* Main label */}
										<label className="block text-gray-700 dark:text-gray-200">
											{field.name}
										</label>

										{/* Sub-description or placeholder */}
										{field.placeholder && (
											<p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
												{field.placeholder}
											</p>
										)}

										{/* Input Field */}
										<InputField
											field={field}
											value={formData[field.name] || ""}
											onChange={(e) =>
												handleInputChange(
													field.name,
													e.target.value,
													e
												)
											}
										/>
									</div>
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
		</div>
	);
};

const InputField = ({ field, value, onChange }) => {
	if (field.type === "dropdown") {
		return (
			<div className="mb-4">
				<label className="block text-gray-700 dark:text-gray-200">
					{/* {field.name} */}
				</label>
				<select
					className="border dark:border-gray-600 w-full p-2 rounded-md dark:bg-gray-700 dark:text-gray-300"
					required={field.required}
					value={value}
					onChange={onChange}
				>
					<option value="">Please select</option>
					{field.options.map((option) => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>
			</div>
		);
	} else if (field.type === "file") {
		return (
			<div className="mb-4">
				<input
					type={field.type}
					required={field.required}
					onChange={onChange}
				/>
			</div>
		);
	} else {
		return (
			<div className="mb-4">
				<input
					className="border dark:border-gray-600 w-full p-2 rounded-md dark:bg-gray-700 dark:text-gray-300"
					placeholder={field.name}
					type={field.type}
					required={field.required}
					value={value}
					onChange={onChange}
				/>
			</div>
		);
	}
};

export default Application;
