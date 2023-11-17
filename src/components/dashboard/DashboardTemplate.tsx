import { useToggle } from "@/hooks/general";
import { DashboardTemplateProps } from "@/types/dashboard";
import { classNames } from "@/utils/helpers";
import { RxHamburgerMenu } from "react-icons/rx";
import Sidebar from "./Sidebar";

const DashboardTemplate = ({ children }: DashboardTemplateProps) => {
  const [show, toggleShow] = useToggle(false);

  return (
    <section className="w-full max-w-5xl max-h-[600px] my-4 px-4 flex gap-4">
      <Sidebar show={show} setShow={toggleShow} />

      <div
        className={classNames(
          "w-full self-start max-h-full ml-4 sm:ml-0",
          show ? "" : "ml-4"
        )}
      >
        <div className="w-full mb-4 rounded-xl border shadow-md bg-white px-4 py-2 sm:hidden flex justify-end">
          <RxHamburgerMenu className="text-xl" onClick={toggleShow} />
        </div>

        <div className="w-full rounded-xl border bg-white mb-4 px-4 p-6 shadow-md overflow-scroll flex items-center flex-col justify-center">
          {children}
        </div>
      </div>
    </section>
  );
};

export default DashboardTemplate;
