import { PAGES, SIDEBAR_LINKS } from "@/constants/constants";
import { SidebarProps } from "@/types/dashboard";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiLogOut } from "react-icons/fi";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { auth } from "@/services/firebase";
import toast from "react-hot-toast";
import { cn, getValueFromTitle } from "@/lib/utils";
import { Button } from "../ui/button";
import { FaAngleRight } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import { useState } from "react";

const Sidebar = ({ show, setShow }: SidebarProps) => {
  const { push, asPath } = useRouter();

  const signOutUser = async () => {
    try {
      await auth.signOut();

      push(PAGES.login);
    } catch (e) {
      toast.error("An error occured.");
    }
  };

  return (
    <div
      className={cn(
        "w-64 sm:w-[19rem] self-start bg-white h-screen overflow-scroll p-2 absolute z-20 sm:z-0 sm:translate-x-0 sm:static flex flex-col border transition-all duration-200 ease-[ease-in-out] gap-1",
        show ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <Button
        onClick={setShow}
        className="bg-blue text-black py-1 px-3 rounded-md sm:hidden w-fit mb-4 self-end text-lg hover:bg-white"
      >
        <MdKeyboardDoubleArrowLeft className="text-black" />
      </Button>

      {SIDEBAR_LINKS.map((b, i) => (
        <Link href={b.link} key={i}>
          <Button
            className={cn(
              "w-full flex items-center justify-start gap-2 py-1 px-4 rounded-lg text-left hover:text-main hover:bg-gray-100",
              b.link === asPath
                ? "bg-gray-100 text-main"
                : "text-black bg-white"
            )}
          >
            <b.icon />
            <p>{b.title}</p>
          </Button>
        </Link>
      ))}

      <Link href={PAGES.mailto} className="mt-auto">
        <Button className="w-full flex items-center justify-start gap-2 px-4 rounded-lg text-left text-black bg-white hover:text-main hover:bg-gray-100">
          <IoMail />
          <p>Contact support</p>
        </Button>
      </Link>

      <Button
        className="w-full flex items-center justify-start gap-2 px-4 rounded-lg text-left text-black bg-white hover:text-red-600 hover:bg-gray-100"
        onClick={signOutUser}
      >
        <FiLogOut />
        <p>Sign out</p>
      </Button>
    </div>
  );
};

export default Sidebar;
