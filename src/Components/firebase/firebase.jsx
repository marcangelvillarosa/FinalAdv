
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB_JSFDuWVhvEKAOUpCf48D2YzUK10F5nE",
  authDomain: "adv102-7de28.firebaseapp.com",
  projectId: "adv102-7de28",
  storageBucket: "adv102-7de28.appspot.com",
  messagingSenderId: "749061995818",
  appId: "1:749061995818:web:6520f04532b508f8e27253"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const db = getFirestore(app);

export
{
    auth,
    db,
    onAuthStateChanged
};