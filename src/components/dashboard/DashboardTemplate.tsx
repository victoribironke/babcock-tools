import { get_help } from "@/atoms/atoms";
import { PAGES } from "@/constants/pages";
import { useToggle } from "@/hooks/general";
import { DashboardTemplateProps } from "@/types/dashboard";
import Link from "next/link";
import { RxHamburgerMenu } from "react-icons/rx";
import { useRecoilState } from "recoil";
import Modal from "../general/Modal";
import Sidebar from "./Sidebar";

const DashboardTemplate = ({ children }: DashboardTemplateProps) => {
  const [show, toggleShow] = useToggle(false);
  const [getHelp, setGetHelp] = useRecoilState(get_help);
  // classNames("w-full ml-4 sm:ml-0", show ? "" : "ml-4")
  return (
    <>
      <section className="w-full min-h-screen flex gap-2">
        <Sidebar show={show} setShow={toggleShow} />

        <div className="w-full p-2 sm:px-2">
          <div className="w-full mb-2 rounded-xl bg-white px-4 py-2 sm:hidden flex justify-end">
            <RxHamburgerMenu className="text-xl" onClick={toggleShow} />
          </div>

          <div className="w-full rounded-xl bg-white px-4 p-6 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-1rem)] overflow-scroll flex items-center flex-col">
            {children}
          </div>
        </div>
      </section>

      {getHelp && (
        <Modal header="Help" dismiss={() => setGetHelp(false)}>
          <p className="w-full text-lg">
            If you have any questions or requests, please send an email to{" "}
            <Link href={PAGES.mailto} className="text-blue">
              hello@babcock.tools
            </Link>
            .
          </p>
        </Modal>
      )}
    </>
  );
};

export default DashboardTemplate;
