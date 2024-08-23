import { auth, db } from "@/services/firebase";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { getFishyDomains, isValidEmail } from "./utils";
import { User } from "@/types/auth";

export const createUser = async (d: {
  full_name: string;
  email: string;
  password: string;
  hall_of_residence: string;
}) => {
  const { email, full_name, password, hall_of_residence } = d;

  const values = [email, full_name, password, hall_of_residence].filter(
    (v) => v === ""
  );

  if (values.length !== 0) {
    return { data: null, error: "Please fill in all the required fields." };
  }

  try {
    // const { data, error } = await getFishyDomains();

    // if (!error && !data?.split("\n").includes(email.split("@")[1])) {
    const user = await setPersistence(auth, browserLocalPersistence).then(() =>
      createUserWithEmailAndPassword(auth, email, password)
    );

    await setDoc(doc(db, "users", user.user.uid), {
      email,
      full_name,
      uid: user.user.uid,
      hall_of_residence,
    });

    return { data: "Succesfully created user.", error: null };
    // } else
    //   return {
    //     error: "You cannot register with that email address.",
    //     data: null,
    //   };
  } catch (e: any) {
    return { data: null, error: "A server error occured." };
  }
};

export const loginUser = async (d: { password: string; email: string }) => {
  const { password, email } = d;

  const values = [password, email].filter((v) => v === "");

  if (values.length !== 0) {
    return { data: null, error: "Please fill in all the required fields." };
  }

  try {
    await setPersistence(auth, browserLocalPersistence).then(() =>
      signInWithEmailAndPassword(auth, email, password)
    );

    return { data: "Succesfully logged in.", error: null };
  } catch (e: any) {
    let error;
    if (e.code && e.code.includes("auth")) error = "Invalid login credentials.";
    else error = "A server error occured.";

    return { data: null, error };
  }
};

export const resetPassword = async (email: string) => {
  if (!email || !isValidEmail(email)) {
    return { data: null, error: "Please input a valid email." };
  }

  try {
    await sendPasswordResetEmail(auth, email);

    return { data: "A password reset link has been sent.", error: null };
  } catch (e: any) {
    return { data: null, error: "A server error occured." };
  }
};
