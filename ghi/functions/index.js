const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
admin.initializeApp();

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword
    }
});

const cors = require('cors')({origin: true});

exports.sendEmail = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
      // Ensure it's a POST request
      if (request.method !== 'POST') {
          response.status(405).send('Method Not Allowed');
          return;
      }

      const data = request.body;

      // Function body remains the same
      const mailOptions = {
          from: gmailEmail,
          to: data.email,
          subject: 'Application Status',
          text: 'Your application has been deleted.'
      };

      try {
          const info = await transporter.sendMail(mailOptions);
          response.send(info); // send the success info to the client
      } catch (error) {
          console.error('Error sending email:', error);
          response.status(500).send('Failed to send email.');
      }
  });
});


exports.assignAdminRole = functions.https.onCall((data, context) => {
   // Check if the request is made by an authenticated user
   if (context.auth) {
      const email = data.email;
      return admin.auth().getUserByEmail(email)
         .then(user => {
            return admin.auth().setCustomUserClaims(user.uid, {admin: true});
         })
         .then(() => {
            return {message: `Success! ${email} has been made an admin.`};
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
