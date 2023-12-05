import { TOOLS } from "@/constants/babcock";
import { PAGES } from "@/constants/pages";
import Link from "next/link";

const Tools = () => {
  return (
    <div className="w-full flex flex-col gap-4 mt-8 items-center justify-center">
      {TOOLS.map((t, i) => (
        <div
          className="p-3 rounded-xl border bg-white shadow-md flex gap-4 w-full max-w-[600px] pr-6"
          key={i}
        >
          <div className="bg-opacity-10 text-blue bg-blue p-3.5 grid place-items-center rounded-md text-5xl w-fit">
            <t.icon />
          </div>

          <div className="flex flex-col justify-between gap-1">
            <p className="flex text-lg font-medium">{t.title}</p>

            <p>{t.desc}</p>

            <Link
              href={t.link}
              className="flex bg-blue text-white py-1 px-3 my-1 rounded-md w-fit"
            >
              Check out the tool
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tools;
