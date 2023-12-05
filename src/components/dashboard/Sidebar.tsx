import { PAGES } from "@/constants/pages";
import { SidebarProps } from "@/types/dashboard";
import { classNames } from "@/utils/helpers";
import Link from "next/link";
import { useRouter } from "next/router";
import { LuHome } from "react-icons/lu";
import { FiHelpCircle, FiLogOut } from "react-icons/fi";
import { signOutUser } from "@/utils/firebase";
import { IoTicketOutline } from "react-icons/io5";
import { useSetRecoilState } from "recoil";
import { get_help } from "@/atoms/atoms";

const Sidebar = ({ show, setShow }: SidebarProps) => {
  const router = useRouter();
  const setGetHelp = useSetRecoilState(get_help);

  const signOut = async () => {
    await signOutUser();

    router.push(PAGES.home);
  };

  return (
    <div
      className={classNames(
        "w-64 sm:w-80 self-start bg-white border shadow-md rounded-xl max-h-[600px] overflow-scroll p-2 absolute z-20 sm:z-0 sm:translate-x-0 sm:static flex flex-col",
        show ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <button
        className="bg-red text-white py-0.5 px-3 rounded-lg sm:hidden w-fit mb-8 self-end"
        onClick={setShow}
      >
        Close
      </button>

      <div className="flex flex-col w-full gap-2 mb-8">
        <Link
          href={PAGES.dashboard}
          className="flex items-center gap-2 pt-1.5 pb-2 px-3 rounded-lg text-left text-blue bg-opacity-10 bg-blue hover:bg-opacity-20"
        >
          <LuHome />
          <p className="-mb-0.5">Home</p>
        </Link>
      </div>

      <p className="mb-2 text-lg opacity-70 ml-3">Tools</p>

      <div className="flex flex-col w-full gap-2 mb-14">
        <Link
          href={PAGES.sell_your_meal_ticket}
          className="flex items-center gap-2 pt-1.5 pb-2 px-3 rounded-lg text-left text-blue bg-opacity-10 bg-blue hover:bg-opacity-20"
        >
          <IoTicketOutline />
          <p className="-mb-0.5">Sell your meal ticket</p>
        </Link>
      </div>

      <div className="flex flex-col w-full gap-2">
        <button
          className="flex items-center gap-2 pt-1.5 pb-2 px-3 rounded-lg text-left text-blue bg-opacity-10 bg-blue hover:bg-opacity-20"
          onClick={() => setGetHelp(true)}
        >
          <FiHelpCircle />
          <p className="-mb-0.5">Help</p>
        </button>

        <button
          className="flex items-center gap-2 bg-red text-white pt-1.5 pb-2 px-3 rounded-lg text-left"
          onClick={signOut}
        >
          <FiLogOut />
          <p className="-mb-0.5">Sign out</p>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
