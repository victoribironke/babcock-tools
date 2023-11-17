import { useRouter } from "next/router";
import { EmailInput } from "../general/Input";
import { useState } from "react";
import { isValidEmail } from "@/utils/helpers";
import toast from "react-hot-toast";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/services/firebase";
import { PAGES } from "@/constants/pages";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const sendResetLink = async () => {
    if (!email || !isValidEmail(email)) {
      toast.error("Please input a valid email.");
      return;
    }

    try {
      setLoading(true);
      setDisabled(true);

      await sendPasswordResetEmail(auth, email);

      toast.success("A password reset link has been sent.");
      router.push(PAGES.login);
    } catch (e: any) {
      toast.error(`Error: ${e.code.split("/")[1]}`);
    } finally {
      setDisabled(false);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg w-full bg-white p-4 rounded-lg border shadow-md">
      <p className="text-2xl font-medium mb-5">Send a password reset link</p>

      <p className="text-lg mb-1 mt-4">Email</p>
      <EmailInput
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        value={email}
      />

      <button
        disabled={disabled}
        onClick={sendResetLink}
        className="w-full mt-4 bg-blue py-2.5 text-white rounded-md disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
      >
        Send password reset link
        {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
      </button>
    </div>
  );
};

export default ForgotPassword;
