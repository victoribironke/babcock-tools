import { PAGES } from "@/constants/pages";
import Link from "next/link";
import { IoTicketOutline } from "react-icons/io5";

const Tools = () => {
  return (
    <div className="w-full flex flex-col gap-4 mt-8 items-center justify-center">
      <div className="p-3 rounded-xl border bg-white shadow-md flex gap-4 w-full max-w-[600px] pr-6">
        <div className="bg-opacity-10 text-blue bg-blue p-3.5 grid place-items-center rounded-md text-5xl w-fit">
          <IoTicketOutline />
        </div>

        <div className="flex flex-col justify-between gap-1">
          <p className="flex text-lg font-medium">Buy or sell meal tickets</p>

          <p>Sell your meal ticket whenever you are unable to use it.</p>

          <Link
            href={PAGES.meal_ticket}
            className="flex bg-blue text-white py-1 px-3 my-1 rounded-md w-fit"
          >
            Check out the tool
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Tools;
