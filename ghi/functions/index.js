const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

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
