import { PAGES } from "@/constants/pages";
import Link from "next/link";
import { MdOutlinePlayArrow } from "react-icons/md";

const Hero = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4">
      <h1 className="text-blue text-4xl sm:text-5xl font-semibold">
        Babcock Tools
      </h1>
      <h1 className="w-full text-xl sm:text-2xl font-medium text-center">
        A suite of tools to make your life as a student, easier.
      </h1>

      <div className="mt-2 flex flex-col rs:flex-row gap-2 items-center justify-center">
        <Link
          href={PAGES.mailto}
          className="bg-green text-white py-1 px-3 rounded-md"
        >
          Give feedback / suggest a tool
        </Link>

        <Link
          href={PAGES.login}
          className="bg-blue text-white py-1 px-3 rounded-md"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Hero;
