import Login from "@/components/auth/Login";
import HeadTemplate from "@/components/general/HeadTemplate";
import { alreadyLoggedIn } from "@/components/hoc/ProtectedRoute";

const LoginPage = () => {
  return (
    <>
      <HeadTemplate title="Login" />

      <section className="w-full min-h-screen flex items-center justify-center p-4">
        <Login />
      </section>
    </>
  );
};

export default alreadyLoggedIn(LoginPage);
