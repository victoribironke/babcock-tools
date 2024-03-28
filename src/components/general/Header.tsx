import { IMAGES } from "@/constants/images";
import { PAGES } from "@/constants/pages";
import Link from "next/link";

const Header = () => {
  return (
    <header className="max-w-5xl py-6 px-6 flex items-center gap-3 justify-between w-full">
      <Link
        href={PAGES.base_url}
        className="text-2xl sm:text-3xl font-medium text-blue mr-auto"
      >
        babcock.tools
      </Link>

      <Link href={PAGES.login} className="text-blue py-1 sm:text-lg">
        Login
      </Link>
      <Link
        href={PAGES.signup}
        className="bg-blue text-white text-sm sm:text-base rounded-lg py-1 px-3"
      >
        Signup{" "}
      </Link>
    </header>
  );
};

export default Header;
