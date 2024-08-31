import { RxHamburgerMenu } from "react-icons/rx";
import { useToggle } from "@/hooks/general";
import Sidebar from "./Sidebar";
import { DashboardTemplateProps } from "@/types/dashboard";
import { checkAuthentication } from "../hoc/ProtectedRoute";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import { IMAGES } from "@/constants/constants";

const DashboardTemplate = ({ children }: DashboardTemplateProps) => {
  const [show, toggleShow] = useToggle(false);

  return (
    <section className="w-full flex">
      <Sidebar show={show} setShow={toggleShow} />

      <div className="w-full self-start h-screen overflow-scroll">
        <div className="w-full border-b bg-white p-4 flex items-center justify-between">
          <Image
            alt="Logo"
            src={IMAGES.logo.src}
            height={IMAGES.logo.h}
            width={IMAGES.logo.w}
            className="w-8 h-8"
          />

          {show ? (
            <IoClose
              className="text-xl cursor-pointer sm:hidden"
              onClick={toggleShow}
            />
          ) : (
            <RxHamburgerMenu
              className="text-xl cursor-pointer sm:hidden"
              onClick={toggleShow}
            />
          )}
        </div>

        <div className="w-full bg-white flex items-start flex-col justify-center p-4">
          {children}
        </div>
      </div>
    </section>
  );
};

export default checkAuthentication(DashboardTemplate);
