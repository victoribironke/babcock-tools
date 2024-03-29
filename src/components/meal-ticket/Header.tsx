import { PAGES } from "@/constants/pages";
import Link from "next/link";

const Header = () => {
  return (
    <header className="w-full flex flex-wrap gap-2 items-center justify-center bg-blue p-4 hadow-md rounded-xl">
      <Link
        href={PAGES.how_does_the_meal_ticket_tool_work}
        className="flex bg-white text-blue py-1 px-3 rounded-md w-fit rs:mr-auto"
      >
        How does it work?
      </Link>

      <Link
        href={PAGES.sell_your_meal_ticket}
        className="flex bg-white text-blue py-1 px-3 rounded-md w-fit"
      >
        Sell a ticket
      </Link>

      <Link
        href={PAGES.login}
        className="flex bg-white text-blue py-1 px-3 rounded-md w-fit"
      >
        Login
      </Link>
    </header>
  );
};

export default Header;
