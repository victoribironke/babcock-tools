import {
  EmailInput,
  NumberInput,
  PasswordInput,
  SelectInput,
  TextInput,
} from "../general/Input";
import { useState } from "react";
import toast from "react-hot-toast";
import { isValidEmail } from "@/utils/helpers";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
} from "firebase/auth";
import { auth, db } from "@/services/firebase";
// import { useRouter } from "next/router";
import { PAGES } from "@/constants/pages";
import Link from "next/link";
import { doc, setDoc } from "firebase/firestore";
import { HALLS_OF_RESIDENCE } from "@/constants/babcock";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useToggle } from "@/hooks/general";

const Signup = () => {
  // const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showPassword, toggleShowPassword] = useToggle(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    hall_of_residence: "Winslow",
    id: "", // Matric No / App ID
  });

  const updateFormData = (text: string, which: string) => {
    setFormData((k) => {
      return { ...k, [which]: text };
    });
  };

  const signUpUser = async () => {
    const { email, password, id, full_name, hall_of_residence, phone } =
      formData;

    if (!full_name) {
      toast.error("Please input your full name.");
      return;
    }

    if (!id) {
      toast.error("Please input your matric no or app id.");
      return;
    }

    if (!phone) {
      toast.error("Please input your phone number.");
      return;
    }

    if (!email || !isValidEmail(email)) {
      toast.error("Please input a valid email.");
      return;
    }

    if (!password) {
      toast.error("Please input a valid password.");
      return;
    }

    try {
      setLoading(true);
      setDisabled(true);

      const user = await setPersistence(auth, browserLocalPersistence).then(
        () => createUserWithEmailAndPassword(auth, email, password)
      );

      await setDoc(doc(db, "users", user.user.uid), {
        email,
        full_name,
        phone_number: phone,
        hall_of_residence,
        matric_no: id,
        email_verified: user.user.emailVerified,
        uid: user.user.uid,
      });

      localStorage.setItem(
        "bt_user_info",
        JSON.stringify({
          email,
          full_name,
          hall_of_residence,
          matric_no: id,
          phone_number: phone,
          is_deliverer: false,
        })
      );
      toast.success("Account created.");
      // router.reload();
    } catch (e: any) {
      toast.error(`Error: ${e.code.split("/")[1]}.`);
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  };

  return (
    <div className="max-w-lg w-full bg-white p-4 rounded-lg border shadow-md">
      <p className="text-2xl font-medium mb-5">Create a new account</p>

      <p className="text-lg mb-1">Full name</p>
      <TextInput
        onChange={(e) => updateFormData(e.target.value, "full_name")}
        placeholder="Full name"
        value={formData.full_name}
      />

      <p className="text-lg mb-1 mt-4">Matric no / App ID</p>
      <TextInput
        onChange={(e) => updateFormData(e.target.value, "id")}
        placeholder="Matric No / App ID"
        value={formData.id}
      />

      <p className="text-lg mb-1 mt-4">Hall of residence</p>
      <SelectInput
        onChange={(e) => updateFormData(e.target.value, "hall_of_residence")}
        value={formData.hall_of_residence}
        options={HALLS_OF_RESIDENCE.map((h) => {
          return { value: h, text: h };
        })}
      />

      <p className="text-lg mb-1 mt-4">Email</p>
      <EmailInput
        onChange={(e) => updateFormData(e.target.value, "email")}
        placeholder="Email"
        value={formData.email}
      />

      <p className="text-lg mb-1 mt-4">Phone number</p>
      <NumberInput
        onChange={(e) => updateFormData(e.target.value, "phone")}
        placeholder="Phone number"
        value={formData.phone}
        maxLength={11}
      />

      <p className="text-lg mt-4 mb-1">Password</p>
      <div className="relative flex items-center justify-center">
        <PasswordInput
          onChange={(e) => updateFormData(e.target.value, "password")}
          placeholder="Password"
          value={formData.password}
          type={showPassword ? "text" : "password"}
        />
        <button
          className="absolute right-2 text-blue"
          onClick={toggleShowPassword}
        >
          {showPassword ? (
            <LuEyeOff className="text-lg" />
          ) : (
            <LuEye className="text-lg" />
          )}
        </button>
      </div>

      <div className="mt-4 flex justify-between items-center flex-col rs:flex-row gap-2">
        <p>
          Already have an account?{" "}
          <Link href={PAGES.login} className="text-blue">
            login
          </Link>
        </p>

        <Link href={PAGES.forgot_password} className="text-blue">
          Forgot password?
        </Link>
      </div>

      <button
        disabled={disabled}
        onClick={signUpUser}
        className="w-full mt-4 bg-blue py-2.5 text-white rounded-md disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
      >
        Create account
        {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
      </button>
    </div>
  );
};

export default Signup;
