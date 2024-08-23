import { useRouter } from "next/router";
import { useState } from "react";
import { isValidEmail } from "@/lib/utils";
import toast from "react-hot-toast";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/services/firebase";
import { PAGES } from "@/constants/constants";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import HeadTemplate from "@/components/general/HeadTemplate";
import { resetPassword } from "@/lib/firebase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendResetLink = async () => {
    setLoading(true);

    const { data, error } = await resetPassword(email);

    setLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success(data);
  };

  return (
    <>
      <HeadTemplate title="Forgot password" />

      <div className="max-w-lg w-full bg-white p-4 rounded-lg border shadow-md">
        <p className="text-2xl font-medium mb-5">Send a password reset link</p>

        <p className="text-lg mb-1 mt-4">Email</p>
        <Input
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          value={email}
        />

        <Button
          disabled={loading}
          onClick={sendResetLink}
          className="w-full mt-4 bg-main hover:bg-main/90 py-2.5 text-white rounded-md flex items-center justify-center gap-2"
        >
          Send password reset link
          {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
        </Button>
      </div>
    </>
  );
};

export default ForgotPassword;
