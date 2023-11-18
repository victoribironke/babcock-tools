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

      <div className="mt-2 flex flex-col sm:flex-row gap-2 items-center justify-center">
        <Link
          href={PAGES.mailto}
          className="bg-green text-white py-2 px-4 rounded-md sm:text-lg"
        >
          Give feedback
        </Link>

        <MdOutlinePlayArrow className="-rotate-90 sm:rotate-180 text-lg" />

        <Link href={PAGES.mailto} className="sm:text-lg">
          hello@babcock.tools
        </Link>

        <MdOutlinePlayArrow className="rotate-90 sm:rotate-0 text-lg" />

        <Link
          href={PAGES.mailto}
          className="bg-green text-white py-2 px-4 rounded-md sm:text-lg"
        >
          Suggest a tool
        </Link>
      </div>
    </div>
  );
};

export default Hero;
