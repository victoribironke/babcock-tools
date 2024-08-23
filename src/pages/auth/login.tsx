import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRouter } from "next/router";
import Link from "next/link";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useToggle } from "@/hooks/general";
import { Input } from "@/components/ui/input";
import { PAGES } from "@/constants/constants";
import { alreadyLoggedIn } from "@/components/hoc/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/lib/firebase";
import HeadTemplate from "@/components/general/HeadTemplate";

const Login = () => {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, toggleShowPassword] = useToggle(false);
  const [formData, setFormData] = useState({
    password: "",
    email: "",
  });

  const updateFormData = (text: string, which: string) => {
    setFormData((k) => {
      return { ...k, [which]: text };
    });
  };

  const login = async () => {
    setLoading(true);

    const { error } = await loginUser(formData);

    setLoading(false);

    if (error) {
      toast.error(error);

      return;
    }

    push(PAGES.dashboard);
  };

  return (
    <>
      <HeadTemplate title="Login" />

      <div className="max-w-lg w-full bg-white p-4 rounded-lg border shadow-md">
        <p className="text-2xl font-medium mb-5">Login to your account</p>

        <p className="text-lg mb-1">Email address</p>
        <Input
          onChange={(e) => updateFormData(e.target.value, "email")}
          placeholder="Email address"
          value={formData.email}
        />

        <p className="text-lg mt-4 mb-1">Password</p>
        <div className="relative flex items-center justify-center">
          <Input
            onChange={(e) => updateFormData(e.target.value, "password")}
            placeholder="Password"
            value={formData.password}
            type={showPassword ? "text" : "password"}
          />
          <button
            className="absolute right-2 text-main"
            onClick={toggleShowPassword}
          >
            {showPassword ? (
              <LuEyeOff className="text-lg" />
            ) : (
              <LuEye className="text-lg" />
            )}
          </button>
        </div>

        <div className="mt-4 flex justify-between items-center flex-col lg:flex-row gap-2 text-sm">
          <p>
            Don&apos;t have an account?{" "}
            <Link href={PAGES.signup} className="text-main">
              create an account
            </Link>
          </p>

          <Link href={PAGES.forgot_password} className="text-main">
            Forgot password?
          </Link>
        </div>

        <Button
          disabled={loading}
          onClick={login}
          className="w-full mt-4 bg-main hover:bg-main/90 py-2.5 text-white rounded-md flex items-center justify-center gap-2"
        >
          Login
          {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
        </Button>
      </div>
    </>
  );
};

export default alreadyLoggedIn(Login);
