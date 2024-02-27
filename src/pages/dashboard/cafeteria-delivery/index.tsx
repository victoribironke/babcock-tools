import NewOrder from "@/components/dashboard/cafeteria-delivery/NewOrder";
import PastOrders from "@/components/dashboard/cafeteria-delivery/PastOrders";
import HeadTemplate from "@/components/general/HeadTemplate";
import PageLoader from "@/components/general/PageLoader";
import { checkAuthentication } from "@/components/hoc/ProtectedRoute";
import { PAGES } from "@/constants/pages";
import { auth, db } from "@/services/firebase";
import { Deliverer, Order } from "@/types/dashboard";
import { classNames } from "@/utils/helpers";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";

const CafeteriaDeliveryPage = () => {
  const [loading, setLoading] = useState(true);
  const [deliverers, setDeliverers] = useState<Deliverer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<"new" | "past">("new");

  useEffect(() => {
    const user_info = JSON.parse(localStorage.getItem("bt_user_info")!);

    const q1 = query(
      collection(db, "deliverers"),
      where("hall_of_residence", "==", user_info.hall_of_residence)
    );

    const q2 = query(
      collection(db, "orders"),
      where("orderer_id", "==", auth.currentUser?.uid)
    );

    const unsubDeliverers = onSnapshot(q1, (querySnapshot) => {
      setLoading(true);

      const temp_deliverers: Deliverer[] = [];

      querySnapshot.forEach((doc) => {
        temp_deliverers.push(doc.data() as Deliverer);
      });

      setDeliverers(temp_deliverers);
      setLoading(false);
    });

    const unsubOrders = onSnapshot(q2, (querySnapshot) => {
      setLoading(true);
      const temp_orders: Order[] = [];

      querySnapshot.forEach((doc) => {
        temp_orders.push(doc.data() as Order);
      });

      setOrders(temp_orders);
      setLoading(false);
    });

    return () => {
      unsubDeliverers();
      unsubOrders();
    };
  }, []);

  if (loading) return <PageLoader type="full" />;

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

      {tab === "new" && (
        <NewOrder
          setTab={setTab}
          deliverers={deliverers}
          orders={orders.length}
        />
      )}
      {tab === "past" && <PastOrders orders={orders} deliverers={deliverers} />}

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
