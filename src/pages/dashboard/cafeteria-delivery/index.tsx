import NewOrders from "@/components/dashboard/cafeteria-delivery/NewOrder";
import PastOrders from "@/components/dashboard/cafeteria-delivery/PastOrders";
import HeadTemplate from "@/components/general/HeadTemplate";
import { checkAuthentication } from "@/components/hoc/ProtectedRoute";
import { PAGES } from "@/constants/pages";
import { Order } from "@/types/dashboard";
import { classNames } from "@/utils/helpers";
import Link from "next/link";
import { useState } from "react";

const CafeteriaDeliveryPage = () => {
  const [orders] = useState<Order[]>([
    // {
    //   date_ordered: "2024-11-17",
    //   deliverer: { id: "sdadsad", name: "Dikko Chinedu" },
    //   meal_type: "Breakfast",
    //   status: "Delivered",
    // },
  ]);
  const [tab, setTab] = useState<"new" | "past">("new");

  return (
    <>
      <HeadTemplate title="Cafeteria delivery" />

      <div className="w-fit flex items-center p-1 justify-center rounded-xl bg-gray-100">
        <button
          className={classNames(
            "rounded-lg py-2 px-4",
            tab === "new" && "bg-white"
          )}
          onClick={() => setTab("new")}
        >
          New order
        </button>
        <button
          className={classNames(
            "rounded-lg py-2 px-4",
            tab === "past" && "bg-white"
          )}
          onClick={() => setTab("past")}
        >
          Past orders
        </button>
      </div>

      {tab === "new" && <NewOrders setTab={setTab} />}
      {/* WHEN THEY WANT TO PLACE AN ORDER, GENERATE AN ID THAT IS GOING TO BE THE SAME EVERYTIME FOR THAT SPECIFIC ORDER, WITH THE PERSON'S UID */}
      {tab === "past" && <PastOrders orders={orders} />}

      <Link
        href={PAGES.register_as_a_deliverer}
        className="bg-blue text-white py-1 px-3 rounded-md hover:underline fixed bottom-4 right-4"
      >
        Register as a deliverer
      </Link>
    </>
  );
};

export default checkAuthentication(CafeteriaDeliveryPage);
