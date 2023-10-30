const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();



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
