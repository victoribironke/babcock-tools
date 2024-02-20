import HeadTemplate from "@/components/general/HeadTemplate";
import PageLoader from "@/components/general/PageLoader";
import { checkAuthentication } from "@/components/hoc/ProtectedRoute";
import { PAGES } from "@/constants/pages";
import { auth, db } from "@/services/firebase";
import { Order, User } from "@/types/dashboard";
import {
  formatNumber,
  getOrdersByMealType,
  getUsersByHall,
} from "@/utils/helpers";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { IoFastFoodOutline } from "react-icons/io5";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AdminPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  // const [deliverers, setDeliverers] = useState<Deliverer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (auth.currentUser?.uid !== "h8o1yv93IdRAls2euKGINJ6qGzj2") {
      router.push(PAGES.dashboard);
    }

    // const unsubDeliverer = onSnapshot(
    //   query(collection(db, "deliverers")),
    //   (querySnapshot) => {
    //     setLoading(true);
    //     const temp_deliverers: Deliverer[] = [];

    //     querySnapshot.forEach((doc) => {
    //       temp_deliverers.push(doc.data() as Deliverer);
    //     });

    //     setDeliverers(temp_deliverers);
    //     setLoading(false);
    //   }
    // );

    const unsubOrders = onSnapshot(
      query(collection(db, "orders")),
      (querySnapshot) => {
        setLoading(true);
        const temp_orders: Order[] = [];

        querySnapshot.forEach((doc) => {
          temp_orders.push(doc.data() as Order);
        });

        setOrders(temp_orders);
        setLoading(false);
      }
    );

    const unsubUsers = onSnapshot(
      query(collection(db, "users")),
      (querySnapshot) => {
        setLoading(true);
        const temp_users: User[] = [];

        querySnapshot.forEach((doc) => {
          temp_users.push(doc.data() as User);
        });

        setUsers(temp_users);
        setLoading(false);
      }
    );

    return () => {
      unsubUsers();
      unsubOrders();
      // unsubDeliverer();
    };
  }, []);

  if (loading) return <PageLoader type="full" />;

  return (
    <>
      <HeadTemplate title="Admin" />

      <section className="flex w-full flex-col max-w-6xl">
        <div className="w-full mb-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
          <div className="p-5 w-full max-w-[22rem] border-2 rounded-lg flex gap-6 items-center">
            <div className="bg-blue bg-opacity-10 p-4 rounded-lg">
              <CgProfile className="text-2xl sm:text-3xl text-blue" />
            </div>
            <div>
              <p className="font-medium">Number of users</p>
              <p className="font-light">{users.length}</p>
            </div>
          </div>

          <div className="p-5 w-full max-w-[22rem] border-2 rounded-lg flex gap-6 items-center">
            <div className="bg-blue bg-opacity-10 p-4 rounded-lg">
              <IoFastFoodOutline className="text-2xl sm:text-3xl text-blue" />
            </div>
            <div>
              <p className="font-medium">Number of orders</p>
              <p className="font-light">{orders.length}</p>
            </div>
          </div>
        </div>

        <div className="w-full pt-4 mb-5 pr-6 pb-2 rounded-lg border-2">
          <p className="w-full pl-10 pb-4 font-medium text-lg">
            Number of users by hall
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={getUsersByHall(users)}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={16}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={16}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={false}
                formatter={(k) => formatNumber(k as number)}
              />
              <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full pt-4 mb-5 pr-6 pb-2 rounded-lg border-2">
          <p className="w-full pl-10 pb-4 font-medium text-lg">
            Number of orders by meal type
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={getOrdersByMealType(orders)}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={16}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={16}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={false}
                formatter={(k) => formatNumber(k as number)}
              />
              <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  );
};
export default checkAuthentication(AdminPage);
