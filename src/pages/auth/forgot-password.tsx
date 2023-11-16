import ForgotPassword from "@/components/auth/ForgotPassword";
import HeadTemplate from "@/components/general/HeadTemplate";

const ForgotPasswordPage = () => {
  return (
    <>
      <HeadTemplate title="Forgot password" />

      <section className="w-full min-h-screen flex items-center justify-center p-4">
        <ForgotPassword />
      </section>
    </>
  );
};

export default ForgotPasswordPage;
