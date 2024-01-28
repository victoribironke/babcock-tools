import { EmailInput, PasswordInput } from "../general/Input";
import { useState } from "react";
import toast from "react-hot-toast";
import { isValidEmail } from "@/utils/helpers";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/services/firebase";
import { useRouter } from "next/router";
import { PAGES } from "@/constants/pages";
import Link from "next/link";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useToggle } from "@/hooks/general";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  const router = useRouter();
  // const { redirect } = router.query;
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showPassword, toggleShowPassword] = useToggle(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const updateFormData = (text: string, which: string) => {
    setFormData((k) => {
      return { ...k, [which]: text };
    });
  };

  const signInUser = async () => {
    const { email, password } = formData;

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
        () => signInWithEmailAndPassword(auth, email, password)
      );

      const user_details = (
        await getDoc(doc(db, "users", user.user.uid))
      ).data();

      localStorage.setItem(
        "bt_user_info",
        JSON.stringify({
          email: user_details?.email,
          full_name: user_details?.full_name,
          hall_of_residence: user_details?.hall_of_residence,
          matric_no: user_details?.matric_no,
          phone_number: user_details?.phone_number,
          is_deliverer: user_details?.is_deliverer ?? false,
        })
      );
      toast.success("Logged in.");
      router.reload();
      // redirect ? router.push(redirect as string) : router.reload();
    } catch (e: any) {
      toast.error(`Error: ${e.code.split("/")[1]}.`);
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  };

  return (
    <div className="max-w-lg w-full bg-white p-4 rounded-lg border shadow-md">
      <p className="text-2xl font-medium mb-5">Login to your account</p>

      <p className="text-lg mb-1">Email</p>
      <EmailInput
        onChange={(e) => updateFormData(e.target.value, "email")}
        placeholder="Email"
        value={formData.email}
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
          Don&apos;t have an account?{" "}
          <Link href={PAGES.signup} className="text-blue">
            signup
          </Link>
        </p>

        <Link href={PAGES.forgot_password} className="text-blue">
          Forgot password?
        </Link>
      </div>

      <button
        disabled={disabled}
        onClick={signInUser}
        className="w-full mt-4 bg-blue py-2.5 text-white rounded-md disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
      >
        Login
        {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
      </button>
    </div>
  );
};

export default Login;
