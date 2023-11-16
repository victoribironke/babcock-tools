import HeadTemplate from "@/components/general/HeadTemplate";
import { PAGES } from "@/constants/pages";
import { getCurrentUser, signOutUser } from "@/utils/firebase";
import { signOut } from "firebase/auth";

const Home = () => {
  return (
    <>
      <HeadTemplate />

      <a href={PAGES.login}>Login</a>
      <a href={PAGES.signup}>Signup</a>
      {getCurrentUser() && (
        <button onClick={signOutUser} className="text-red">
          Signout
        </button>
      )}
    </>
  );
};

export default Home;
