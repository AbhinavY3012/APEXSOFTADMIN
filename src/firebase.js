// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_zBATLeIS5pJx_KMlf3mL85qa1NB0PFc",
  authDomain: "apexsoft-technology.firebaseapp.com",
  projectId: "apexsoft-technology",
  storageBucket: "apexsoft-technology.firebasestorage.app",
  messagingSenderId: "495641986913",
  appId: "1:495641986913:web:b9379ed4edb877f28de720",
  measurementId: "G-47BEMST5VW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, analytics };
export default app;
