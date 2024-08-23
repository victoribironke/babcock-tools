import { auth, db } from "@/services/firebase";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import toast from "react-hot-toast";
import {
  createSubaccount,
  getFishyDomains,
  isValidEmail,
  updateSubaccount,
} from "./utils";
import { User } from "@/types/auth";
import { Event } from "@/types/dashboard";

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

export const createEvent = async (d: Event) => {
  const values = [
    d.date_time,
    d.description,
    !d.is_free ? d.price_per_ticket : null,
    d.name,
    d.support_email,
    d.type === "physical" ? d.location : d.link,
    d.account_name,
    d.account_number,
    d.bank_code,
  ].filter((v) => v === "");

  if (values.length !== 0) {
    return { data: null, error: "Please fill in all the required fields." };
  }

  try {
    let code = "";

    if (!d.is_free) {
      const { data, error } = await createSubaccount(
        d.account_name,
        d.bank_code,
        d.account_number
      );

      if (error) return { data: null, error };

      code = data;
    }

    const { id } = await addDoc(collection(db, "events"), {
      ...d,
      attendees: 0,
      creator: auth.currentUser?.uid,
      created_at: Date.now().toString(),
      subaccount_code: code,
    });

    await updateDoc(doc(db, "events", id), {
      id,
    });

    return { data: id, error: null };
  } catch (e) {
    return { data: null, error: "A server error occured." };
  }
};

export const editEvent = async (d: Event, e: Event) => {
  const values = [
    d.date_time,
    d.description,
    !d.is_free ? d.price_per_ticket : null,
    d.name,
    d.support_email,
    d.type === "physical" ? d.location : d.link,
    d.account_name,
    d.account_number,
    d.bank_code,
  ].filter((v) => v === "");

  if (values.length !== 0) {
    return { data: null, error: "Please fill in all the required fields." };
  }

  try {
    let code = "";

    if (!d.is_free) {
      if (d.subaccount_code) {
        if (
          d.bank_code !== e.bank_code &&
          d.account_number !== e.account_number
        ) {
          const { error } = await updateSubaccount(
            d.subaccount_code,
            d.account_name,
            d.account_number,
            d.bank_code
          );

          if (error) return { data: null, error };
        }

        code = d.subaccount_code;
      } else {
        const { data, error } = await createSubaccount(
          d.account_name,
          d.bank_code,
          d.account_number
        );

        if (error) return { data: null, error };

        code = data;
      }
    } // checks if there was already a subaccount, in which case, it would be edited, else, a new one would be created

    await updateDoc(doc(db, "events", d.id), {
      ...d,
      subaccount_code: code,
    });

    return { data: d.id, error: null };
  } catch (e) {
    console.log(e);
    return { data: null, error: "A server error occured." };
  }
};
