import DeliverersDetails from "@/components/dashboard/cafeteria-delivery/DeliverersDetails";
import DeliverersOrders from "@/components/dashboard/cafeteria-delivery/DeliverersOrders";
import HeadTemplate from "@/components/general/HeadTemplate";
import PageLoader from "@/components/general/PageLoader";
import { checkAuthentication } from "@/components/hoc/ProtectedRoute";
import { PAGES } from "@/constants/pages";
import { auth, db } from "@/services/firebase";
import { Deliverer, Order, User } from "@/types/dashboard";
import { classNames } from "@/utils/helpers";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const DelivererProfile = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [deliverer, setDeliverer] = useState<Deliverer>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<"orders" | "profile">("orders");
  const router = useRouter();

  useEffect(() => {
    const user_info = JSON.parse(localStorage.getItem("bt_user_info")!);

    // if (!user_info.is_deliverer) {
    //   toast.error("You are not a deliverer.");
    //   router.push(PAGES.cafeteria_delivery);
    //   return;
    // }

    const q1 = query(
      collection(db, "deliverers"),
      where("uid", "==", auth.currentUser?.uid)
    );

    const q2 = query(
      collection(db, "orders"),
      where("deliverer_id", "==", auth.currentUser?.uid)
    );

    const q3 = query(
      collection(db, "users"),
      where("hall_of_residence", "==", user_info.hall_of_residence)
    );

    const unsubDeliverer = onSnapshot(q1, (querySnapshot) => {
      setLoading(true);

      if (querySnapshot.docs[0]) {
        setDeliverer(querySnapshot.docs[0].data() as Deliverer);
        setLoading(false);
      } else {
        toast.error("You are not a deliverer.");
        router.push(PAGES.cafeteria_delivery);
        return;
      }
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

    const unsubUsers = onSnapshot(q3, (querySnapshot) => {
      setLoading(true);

      const temp_users: User[] = [];

      querySnapshot.forEach((doc) => {
        temp_users.push(doc.data() as User);
      });

      setUsers(temp_users);
      setLoading(false);
    });

    return () => {
      unsubUsers();
      unsubOrders();
      unsubDeliverer();
    };
  }, []);

  if (loading) return <PageLoader type="full" />;

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

      {tab === "orders" && <DeliverersOrders orders={orders} users={users} />}
      {tab === "profile" && <DeliverersDetails deliverer={deliverer} />}
    </>
  );
};

export default checkAuthentication(DelivererProfile);
