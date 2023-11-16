import Login from "@/components/auth/Login";
import Signup from "@/components/auth/Signup";
import HeadTemplate from "@/components/general/HeadTemplate";
import { EmailInput } from "@/components/general/Input";
import { alreadyLoggedIn } from "@/components/hoc/ProtectedRoute";

const SignupPage = () => {
  return (
    <>
      <HeadTemplate title="Signup" />

      <section className="w-full min-h-screen flex items-center justify-center p-4">
        <Signup />
      </section>
    </>
  );
};

export default alreadyLoggedIn(SignupPage);
