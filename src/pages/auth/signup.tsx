import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRouter } from "next/router";
import Link from "next/link";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useToggle } from "@/hooks/general";
import { Input } from "@/components/ui/input";
import { HALLS_OF_RESIDENCE, PAGES } from "@/constants/constants";
import { alreadyLoggedIn } from "@/components/hoc/ProtectedRoute";
import { createUser } from "@/lib/firebase";
import HeadTemplate from "@/components/general/HeadTemplate";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { is } from "../_app";
import { cn } from "@/lib/utils";

const Signup = () => {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, toggleShowPassword] = useToggle(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    hall_of_residence: "",
  });

  const updateFormData = (text: string, which: string) => {
    setFormData((k) => {
      return { ...k, [which]: text };
    });
  };

  const signUpUser = async () => {
    setLoading(true);

    const { error } = await createUser(formData);

    setLoading(false);

    if (error) {
      toast.error(error);

      return;
    }

    push(PAGES.dashboard);
  };

  return (
    <>
      <HeadTemplate title="Create an account" />

      <div className="max-w-lg w-full bg-white p-4 rounded-lg border shadow-md">
        <p className="text-2xl font-medium mb-5">Create a new account</p>

        <p className="text-lg mb-1">Full name</p>
        <Input
          onChange={(e) => updateFormData(e.target.value, "full_name")}
          placeholder="Full name"
          value={formData.full_name}
        />

        <p className="text-lg mb-1 mt-4">Email address</p>
        <Input
          onChange={(e) => updateFormData(e.target.value, "email")}
          placeholder="Email address"
          value={formData.email}
          type="email"
        />

        <p className="text-lg mt-4 mb-1">Hall of residence</p>
        <Select
          value={formData.hall_of_residence}
          onValueChange={(e) => updateFormData(e, "hall_of_residence")}
        >
          <SelectTrigger className="w">
            <SelectValue placeholder="Select a hall" />
          </SelectTrigger>
          <SelectContent className={cn("border", is.className)}>
            <SelectGroup>
              <SelectLabel>Halls</SelectLabel>
              {HALLS_OF_RESIDENCE.map((h, i) => (
                <SelectItem value={h} key={i} className="cursor-pointer">
                  {h}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

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
            Already have an account?{" "}
            <Link href={PAGES.login} className="text-main">
              login
            </Link>
          </p>
        </div>

        <button
          disabled={loading}
          onClick={signUpUser}
          className="w-full mt-4 bg-main hover:bg-main/90 py-2.5 text-white rounded-md flex items-center justify-center gap-2"
        >
          Create account
          {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
        </button>
      </div>
    </>
  );
};

export default alreadyLoggedIn(Signup);
