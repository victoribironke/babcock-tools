import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBnAhWvlQiaVeAGr6JaP6NN82O0fhH79tk",
  authDomain: "babcock-tools.firebaseapp.com",
  projectId: "babcock-tools",
  storageBucket: "babcock-tools.appspot.com",
  messagingSenderId: "619270633137",
  appId: "1:619270633137:web:4be5909954c5631c23d490",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
