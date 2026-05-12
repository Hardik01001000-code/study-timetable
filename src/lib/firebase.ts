import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6qzjL91Og7voA1JOHoME22NNoepzAyNg",
  authDomain: "study-timetable-538cb.firebaseapp.com",
  projectId: "study-timetable-538cb",
  storageBucket: "study-timetable-538cb.firebasestorage.app",
  messagingSenderId: "38875097860",
  appId: "1:38875097860:web:c553a1cc092a540411be51",
  measurementId: "G-NX1PT1XLX5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Collection references
export const subjectsCollection = collection(db, 'subjects');
export const topicsCollection = collection(db, 'topics');
