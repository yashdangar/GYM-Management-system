const admin = require('firebase-admin');

// Parse the service account credentials from the environment variable
const serviceAccount = require(`../serviceAccountKey.json`);

// Initialize Firebase Admin with the credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gym-images-f841e.appspot.com', // If you're using Firebase Storage
});

console.log('Firebase Admin Initialized');
