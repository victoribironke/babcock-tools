import { TOOLS } from "@/constants/babcock";
import Link from "next/link";
import { BsStars } from "react-icons/bs";

const Tools = () => {
  return (
    <div className="w-full flex flex-col gap-6 mt-8 items-center justify-center">
      {TOOLS.map((t, i) => (
        <div
          className="p-3 rounded-xl border bg-white shadow-md flex gap-4 w-full max-w-[600px] pr-6 relative"
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
          {t.is_new && (
            <div className="bg-green self-center text-white rounded py-0.5 px-2 absolute right-4 -top-3 flex gap-1 items-center justify-center">
              <BsStars /> New
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Tools;
