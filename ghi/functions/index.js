const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();



exports.assignAdminRole = functions.https.onCall((data, context) => {
  // Check if the request is made by an authenticated user
  if (context.auth) {
    const email = data.email;
    return admin.auth().getUserByEmail(email)
      .then(user => {
        return admin.auth().setCustomUserClaims(user.uid, { admin: true });
      })
      .then(() => {
        return { message: `Success! ${email} has been made an admin.` };
      })
      .catch(err => {
        return err;
      });
  } else {
    throw new functions.https.HttpsError('unauthenticated', 'You must be authenticated to make this request.');
  }
});


// Assigns the role 'guest' to every new user that signs up.
exports.assignGuestRole = functions.auth.user().onCreate((user) => {
  return admin.firestore().collection('users').doc(user.uid).set({
    email: user.email,
    role: 'guest'
  });
});

// A simple HTTP callable function to set 'c.r.zambito@gmail.com' as admin.
// Trigger this function once to set the user as an admin.
exports.setAdmin = functions.https.onRequest(async (req, res) => {
  try {
    const uid = "mxUGZvpR44doKJYXMIZ66Hb7pTt1"; // UID for 'c.r.zambito@gmail.com'
    await admin.firestore().collection('users').doc(uid).update({
      role: 'admin'
    });
    res.status(200).send('Successfully set user as admin!');
  } catch (error) {
    console.error('Error setting user as admin:', error);
    res.status(500).send('Failed to set user as admin.');
  }
});



const axios = require('axios');
const cors = require('cors')({ origin: true });

exports.askOpenAI = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    console.log('Function triggered, starting execution');

    if (req.method !== 'POST') {
      console.log('Method not POST, returning 405');
      return res.status(405).send('Method Not Allowed');
    }

    const prompt = req.body.prompt;
    console.log('Received prompt:', prompt);

    try {
      console.log('Attempting to make request to OpenAI with prompt:', prompt);
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user",
          content: prompt
        }]
      }, {
        headers: {
          'Authorization': `Bearer ${functions.config().openai.key}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response from OpenAI:', response.data);

      const answer = response.data.choices && response.data.choices[0] && response.data.choices[0].message.content.trim();
      console.log('Extracted answer:', answer);
      res.json({ answer: answer });
    } catch (error) {
      console.error('Detailed error:', error);
      if (error.response) {
        console.error('OpenAI Response Error:', error.response.data, error.response.status);
      }
      res.status(500).send('Error in OpenAI request: ' + error.message);
    }
  });
});



exports.autoClockOutUsers = functions.pubsub.schedule('0 0 * * *') // Runs daily at midnight
  .timeZone('America/New_York')
  .onRun(async (context) => {
    const db = admin.firestore();

    // Today's date
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // 11:59 PM of yesterday
    const autoClockOutTime = new Date(currentDate);
    autoClockOutTime.setMinutes(-1);  // 1 minute before midnight

    const attendanceQuery = db.collection('attendance')
      .where('clockOutTime', '==', null)
      .where('date', '<', currentDate);

    const forgotToClockOutUsers = [];
    const snapshot = await attendanceQuery.get();
    if (!snapshot.empty) {
      for (let doc of snapshot.docs) {
        const attendance = doc.data();
        forgotToClockOutUsers.push(attendance.userID); // Assuming you have a userID field in the attendance doc
        await doc.ref.update({
          // clockOutTime: admin.firestore.Timestamp.fromDate(autoClockOutTime)
          clockOutTime: autoClockOutTime.toISOString()
        });
      }
    }

    if (forgotToClockOutUsers.length > 0) {
      // Send email notification
      const notificationRef = db.collection('mail').doc();
      await notificationRef.set({
        to: ['c.r.zambito@gmail.com', 'fjzllc@gmail.com', 'bz814@aol.com'],
        message: {
          subject: 'Users Forgot to Clock Out!',
          text: `The following users forgot to clock out on ${currentDate.toLocaleDateString()}: ${forgotToClockOutUsers.join(', ')}. Their records have been auto-adjusted.`,
          html: `<strong>The following users forgot to clock out:</strong><br>${forgotToClockOutUsers.join('<br>')}.<br><br><p>**This is an automated email. Please do not reply.**</p>`
        }
      });
    }

    return null; // Fulfill the function promise
  });

// delete old bookings every day at midnight
exports.deleteOldBookings = functions.pubsub.schedule('every 24 hours').timeZone('America/New_York').onRun(async (context) => {
  const currentDate = new Date();

  // Get all bookings before today
  const bookings = db.collection('bookings').where('date', '<', currentDate);

  const snapshot = await bookings.get();

  // Delete old bookings
  const batch = db.batch();
  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  await batch.commit();

  console.log(`Deleted ${snapshot.size} old bookings.`);
  return null; // Indicates function execution is complete
});


// clean up of users, any user who has default role of guest for 90 days will be deleted
//and user with role X will be deleted at midnight
exports.dailyCleanup = functions.pubsub.schedule('0 0 * * *').timeZone('America/New_York').onRun(async (context) => {

  const usersToDelete = [];

  const guestUsersSnapshot = await admin.firestore().collection('users').where('role', '==', 'guest').get();
  const xRoleUsersSnapshot = await admin.firestore().collection('users').where('role', '==', 'X').get();

  const shouldDeleteUser = async (doc, daysOld) => {
    try {
      const userRecord = await admin.auth().getUser(doc.id);
      const creationTime = new Date(userRecord.metadata.creationTime);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      return creationTime <= cutoffDate;
    } catch (error) {
      console.error("Error checking user:", error);
      return false;
    }
  };

  for (const doc of guestUsersSnapshot.docs) {
    if (await shouldDeleteUser(doc, 90)) {
      usersToDelete.push(doc.id);
    }
  }

  for (const doc of xRoleUsersSnapshot.docs) {
    if (await shouldDeleteUser(doc, 1)) {
      usersToDelete.push(doc.id);
    }
  }

  const batch = admin.firestore().batch();
  for (const uid of usersToDelete) {
    try {
      await admin.auth().deleteUser(uid);
      const userDocRef = admin.firestore().collection('users').doc(uid);
      batch.delete(userDocRef);
    } catch (error) {
      console.error("Error deleting user:", uid, error);
    }
  }
  await batch.commit();
});


// AI Evaluation of Application
exports.evaluateTenant = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {

    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    const applicationData = req.body.applicantData;

    const messages = [
      {
        "role": "user",
        "content": "Hello! I'd like an evaluation of a tenant. Please format your response with clear paragraphs and line breaks. Here's the data:"
      },

      {
      "role": "user",
      "content": `🔍 Tenant Risk Assessment Request:

      - Name: ${applicationData['First Name']} ${applicationData['Middle Initial']} ${applicationData['Last Name']}
      - Email: ${applicationData['Email']}
      - Phone Number: ${applicationData['Phone Number']}
      - Date of Birth: ${applicationData['Date of Birth (DOB)']}
      - Marital Status: ${applicationData['Marital Status']}
      - Monthly Rent at Last Apartment: $${applicationData['Amount of Rent']}
      - Present Home Address: ${applicationData['Present Home Address']}
      - Time at Current Address: ${applicationData['Length of Time at Address']}
      - Landlord Phone: ${applicationData['Landlord Phone']}
      - Reason for Leaving Current Address: ${applicationData['Reason for Leaving']}
      - Present Rent Status: ${applicationData['Is your present rent up to date?']}
      - Number of Occupants: ${applicationData['Number of occupants']}
      - Occupants Details: ${applicationData['Details of each occupant (Name, Age, Occupation)']}
      - Pets: ${applicationData['Do you have pets? How many & type.']}
      - Vehicles: ${applicationData['Number of vehicles']}
      - Vehicle Details: ${applicationData['Details of each vehicle (Make, Model, Color, Plate, Year)']}
      - Employment Status: ${applicationData['Employment Status']}
      - Current Employer and Occupation: ${applicationData['Current Employer']} - ${applicationData['Occupation']}
      - Hours per Week: ${applicationData['Hours per Week']}
      - Supervisor Name: ${applicationData['Supervisor Name']}
      - Annual Income: $${applicationData['Current Income/Amount']}
      - Car Debt: $${applicationData['Current Car Debt']}
      - Credit Card Debt: $${applicationData['Current Credit Card Debt']}
      - Emergency Contact: ${applicationData['Emergency Contact (Name, Phone, Relationship)']}
      - Personal Reference: ${applicationData['Personal Reference (Name, Phone, Relationship)']}
      - Legal Issues with Landlords: ${applicationData['Have you ever been brought to court by another landlord?']}
      - Evictions: ${applicationData['Have you ever been evicted?']}
      - Sheriff Lockouts: ${applicationData['Have you ever been locked out of your apartment by the sheriff?']}
      - Sued for Bills: ${applicationData['Have you ever been sued for bills?']}
      - Bankruptcies: ${applicationData['Have you ever filed for bankruptcy?']}
      - Felony Convictions: ${applicationData['Have you ever been found guilty of a felony?']}
      - Broken Leases: ${applicationData['Have you ever broken a lease?']}
      - Owing Rent/Damaged Previous Apartment: ${applicationData['Have you ever moved owing rent or damaged an apartment?']}
      - Move-in Amount Availability: ${applicationData['Is the total move-in amount available now?']}

      🤔 Now, let's get down to the nitty-gritty. This person seems more guarded than Fort Knox with all their previous landlord run-ins! 😅

      On a scale of 1-100, where do they land on the 'Risky Business' meter? Let's crunch those numbers and see if they're the tenant of dreams... or the kind that comes with a 'handle with care' label! 📈🚨

      Please present this in a dark humor theme that brings a chuckle, but also keeps it real - because who wants to play hide and seek with rent payments? 🙈💸

      Remember, a stitch in time saves nine, and in this case, it might just save the roof over your head! 🏠⏳

      Don't hold back, and be sure to wrap it up in some nifty dark-themed for that sweet dark mode aesthetic. 😎🌒

      Also remember that this is going to help my parents rental properties. so if the person seems like they lied, or are full of BS be sure to target it.`
    },

    {
      "role": "user",
      "content": "🤔 Now, let's get down to the nitty-gritty. This person seems more guarded than Fort Knox ... or the kind that comes with a 'handle with care' label! 📈🚨"
  },
  {
      "role": "user",
      "content": "Please present this in a dark humor theme ...  for that sweet dark mode aesthetic. 😎🌒"
  },
  {
      "role": "user",
      "content": "Also remember that this is going to help my parents rental properties. so if the person seems like they lied, or are full of BS be sure to target it."
  },
  {
    "role": "user",
    "content": "Also a friendly reminder, that the user has already seen the application data, so when you provide your response, you probably don't need to list out everything like name: name, email: email, etc."
  }
  ];



    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: messages
      }, {
        headers: {
          'Authorization': `Bearer ${functions.config().openai.key}`,
          'Content-Type': 'application/json'
        }
      });

      const evaluation = response.data.choices[0].message.content.trim();
      res.json({ evaluation: evaluation });

    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        console.error('OpenAI Response Error:', error.response.data, error.response.status);
      }
      res.status(500).send('Error in OpenAI request');
    }
  });
});
