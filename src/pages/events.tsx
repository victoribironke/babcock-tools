import HeadTemplate from "@/components/general/HeadTemplate";
import { PAGES } from "@/constants/pages";
import { classNames } from "@/utils/helpers";
import Link from "next/link";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";

const Events = () => {
  const [e, setE] = useState<"past" | "coming">("coming");

  return (
    <>
      <HeadTemplate title="Events" />

      <section className="w-full max-w-5xl px-4 sm:px-8 py-12">
        <div className="w-full flex gap-2 items-center justify-center flex-wrap rs:flex-nowrap">
          <button
            className={classNames(
              "flex py-1 px-3 rounded-md w-fit",
              e === "coming" ? "bg-blue text-white" : "bg-gray-300"
            )}
            onClick={() => setE("coming")}
          >
            Coming events
          </button>
          <button
            className={classNames(
              "flex py-1 px-3 rounded-md w-fit rs:mr-auto",
              e === "past" ? "bg-blue text-white" : "bg-gray-300"
            )}
            onClick={() => setE("past")}
          >
            Past events
          </button>
          <Link
            className="flex py-1 px-3 rounded-md w-fit bg-blue text-white items-center justify-center gap-1"
            href={PAGES.new_event}
          >
            <FiPlus /> Create new event
          </Link>
        </div>
      </section>
    </>
  );
};

export default Events;
