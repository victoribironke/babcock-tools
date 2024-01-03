import HeadTemplate from "@/components/general/HeadTemplate";
import { checkAuthentication } from "@/components/hoc/ProtectedRoute";
import { classNames } from "@/utils/helpers";
import { useState } from "react";

const DelivererProfile = () => {
  const [tab, setTab] = useState<"orders" | "profile">("orders");

  return (
    <>
      <HeadTemplate title="Deliverer profile" />

      <div className="w-fit flex items-center p-1 justify-center rounded-xl bg-gray-100">
        <button
          className={classNames(
            "rounded-lg py-2 px-4",
            tab === "orders" && "bg-white"
          )}
          onClick={() => setTab("orders")}
        >
          Orders
        </button>
        <button
          className={classNames(
            "rounded-lg py-2 px-4",
            tab === "profile" && "bg-white"
          )}
          onClick={() => setTab("profile")}
        >
          Profile
        </button>
      </div>
    </>
  );
};

export default checkAuthentication(DelivererProfile);
