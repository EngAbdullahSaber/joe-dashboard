// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0VKSKp3TUQKca7A3sVFkCPgLF3Wvksps",
  authDomain: "joeproproject.firebaseapp.com",
  projectId: "joeproproject",
  storageBucket: "joeproproject.firebasestorage.app",
  messagingSenderId: "221461372283",
  appId: "1:221461372283:web:ff513df04741fcdc3c71de",
  measurementId: "G-2E370SZLEB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
