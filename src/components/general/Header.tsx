import { PAGES } from "@/constants/pages";
import { auth } from "@/services/firebase";
import Link from "next/link";
import { useEffect, useState } from "react";

const Header = () => {
  const [name, setName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const isLoggedIn = auth.currentUser !== null;

    if (isLoggedIn) {
      setLoggedIn(true);

      const userName = JSON.parse(
        localStorage.getItem("bt_user_info")!
      ).full_name;

      setName(userName);
    } else setLoggedIn(false);
  }, [auth.currentUser]);

  return (
    <header className="max-w-5xl py-6 px-6 flex items-center gap-3 justify-between w-full">
      <Link
        href={PAGES.base_url}
        className="text-2xl sm:text-3xl font-medium text-blue mr-auto"
      >
        babcock.tools
      </Link>

      {loggedIn ? (
        <Name name={name} />
      ) : (
        <>
          <Link href={PAGES.login} className="text-blue py-1 sm:text-lg">
            Login
          </Link>
          <Link
            href={PAGES.signup}
            className="bg-blue text-white text-sm sm:text-base rounded-lg py-1 px-3"
          >
            Signup{" "}
          </Link>
        </>
      )}
    </header>
  );
};

const Name = ({ name }: { name: string }) => {
  return (
    <Link
      href={PAGES.dashboard}
      className="rs:bg-blue text-white rs:py-1 rs:px-3 rounded-lg flex items-center justify-center gap-2"
    >
      <img
        src={`https://api.dicebear.com/8.x/identicon/svg?seed=${name}`}
        alt="Event image"
        className="w-6 h-6 rs:w-5 rs:h-5 rounded-full bg-white"
      />{" "}
      <p className="hidden rs:block">{name}</p>
    </Link>
  );
};

export default Header;
