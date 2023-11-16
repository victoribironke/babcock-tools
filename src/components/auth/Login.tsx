import { EmailInput, PasswordInput } from "../general/Input";
import { useState } from "react";
import toast from "react-hot-toast";
import { isValidEmail } from "@/utils/helpers";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/firebase";
import { useRouter } from "next/router";
import { PAGES } from "@/constants/pages";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
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

    setLoading(true);
    setDisabled(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      toast.success("Logged in.");
      router.push(PAGES.home);
    } catch (e: any) {
      toast.error(`Error: ${e.code.split("/")[1]}.`);
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  };

  return (
    <div className="max-w-lg w-full bg-white p-4 rounded-lg shadow-md">
      <p className="text-2xl font-medium mb-5">Login to your account</p>

      <p className="text-lg font-medium mb-1">Email</p>
      <EmailInput
        onChange={(e) => updateFormData(e.target.value, "email")}
        placeholder="Email"
        value={formData.email}
      />

      <p className="text-lg font-medium mt-4 mb-1">Password</p>
      <PasswordInput
        onChange={(e) => updateFormData(e.target.value, "password")}
        placeholder="Password"
        value={formData.password}
      />

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
