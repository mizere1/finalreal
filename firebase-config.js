// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmUY1r58_Yt3V2yKg_2pfFcpKzeOMQQDU",
  authDomain: "cheza-31e92.firebaseapp.com",
  databaseURL: "https://cheza-31e92-default-rtdb.firebaseio.com",
  projectId: "cheza-31e92",
  storageBucket: "cheza-31e92.appspot.com",
  messagingSenderId: "370637402391",
  appId: "1:370637402391:web:f02bf95f74de2b13ddc752"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Analytics not currently used in the app features

// Initialize Firebase services and export them
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

export { app, auth, db, storage };
// mizere
