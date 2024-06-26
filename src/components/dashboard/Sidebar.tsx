import { PAGES } from "@/constants/pages";
import { SidebarProps } from "@/types/dashboard";
import { classNames } from "@/utils/helpers";
import Link from "next/link";
import { useRouter } from "next/router";
import { LuHome } from "react-icons/lu";
import { FiHelpCircle, FiLogOut } from "react-icons/fi";
import { signOutUser } from "@/utils/firebase";
import { IoFastFoodOutline, IoTicketOutline } from "react-icons/io5";
import { useSetRecoilState } from "recoil";
import { get_help } from "@/atoms/atoms";
import { BsCardText, BsStars } from "react-icons/bs";
import { useEffect, useState } from "react";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { auth } from "@/services/firebase";

const Sidebar = ({ show, setShow }: SidebarProps) => {
  const router = useRouter();
  const setGetHelp = useSetRecoilState(get_help);
  const [userInfo, setUserInfo] = useState<any>();

  const signOut = async () => {
    await signOutUser();

    localStorage.removeItem("bt_user_info");
    router.push(PAGES.home);
  };

  useEffect(
    () => setUserInfo(JSON.parse(localStorage.getItem("bt_user_info")!)),
    []
  );

  return (
    <div
      className={classNames(
        "w-64 sm:w-80 self-start bg-dark-blue min-h-screen overflow-scroll p-2 sm:pr-0 absolute z-20 sm:z-0 sm:translate-x-0 sm:static flex flex-col",
        show ? "translate-x-0" : "-translate-x-full"
      )}
      onClick={setShow}
    >
      <button className="bg-blue text-white py-1 px-3 rounded-md sm:hidden w-fit mb-8 self-end text-lg">
        <MdKeyboardDoubleArrowLeft />
      </button>

      <div className="flex flex-col w-full gap-2 mb-8">
        <Link
          href={PAGES.dashboard}
          className={classNames(
            "flex items-center gap-2 pt-1.5 pb-2 px-3 rounded-lg text-left text-white bg-opacity-10 bg-blue hover:bg-opacity-20"
          )}
        >
          <LuHome />
          <p className="-mb-0.5">Home</p>
        </Link>
      </div>

      <p className="mb-2 text-lg opacity-70 ml-3 text-white">Tools</p>

      <div className="flex flex-col w-full gap-2 mb-auto">
        <Link
          href={PAGES.cafeteria_delivery}
          className="flex items-center gap-2 pt-1.5 pb-2 px-3 rounded-lg text-left text-white bg-opacity-10 bg-blue hover:bg-opacity-20"
        >
          <IoFastFoodOutline />
          <p className="-mb-0.5">Cafeteria delivery</p>
        </Link>
        <Link
          href={PAGES.digital_flashcards_dashboard}
          className="flex items-center gap-2 pt-1.5 pb-2 px-3 rounded-lg text-left text-white bg-opacity-10 bg-blue hover:bg-opacity-20"
        >
          <BsCardText />
          <p className="-mb-0.5 mr-auto">Digital flashcards</p>
        </Link>
        <Link
          href={PAGES.events_dashboard}
          className="flex items-center gap-2 pt-1.5 pb-2 px-3 rounded-lg text-left text-white bg-opacity-10 bg-blue hover:bg-opacity-20"
        >
          <BsStars />
          <p className="-mb-0.5 mr-auto">Events</p>
        </Link>
        <Link
          href={PAGES.sell_your_meal_ticket}
          className="flex items-center gap-2 pt-1.5 pb-2 px-3 rounded-lg text-left text-white bg-opacity-10 bg-blue hover:bg-opacity-20"
        >
          <IoTicketOutline />
          <p className="-mb-0.5">Sell your meal ticket</p>
        </Link>
      </div>

      <div className="flex flex-col w-full gap-2">
        {auth.currentUser?.uid === "h8o1yv93IdRAls2euKGINJ6qGzj2" && (
          <Link
            href={PAGES.admin}
            className="flex items-center gap-2 pt-1.5 pb-2 px-3 rounded-lg text-left text-white bg-opacity-10 bg-blue hover:bg-opacity-20"
          >
            <CgProfile />
            <p className="-mb-0.5 mr-auto">Admin</p>
          </Link>
        )}
        <Link
          href={PAGES.account_profile}
          className="flex items-center gap-2 pt-1.5 pb-2 px-3 rounded-lg text-left text-white bg-opacity-10 bg-blue hover:bg-opacity-20"
        >
          <CgProfile />
          <p className="-mb-0.5 mr-auto">Account profile</p>
        </Link>
        {userInfo?.is_deliverer && (
          <Link
            href={PAGES.deliverer_profile}
            className="flex items-center gap-2 pt-1.5 pb-2 px-3 rounded-lg text-left text-white bg-opacity-10 bg-blue hover:bg-opacity-20"
          >
            <IoFastFoodOutline />
            <p className="-mb-0.5 mr-auto">Deliverer profile</p>
          </Link>
        )}
        <button
          className="flex items-center gap-2 pt-1.5 pb-2 px-3 rounded-lg text-left text-white bg-opacity-10 bg-blue hover:bg-opacity-20"
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
