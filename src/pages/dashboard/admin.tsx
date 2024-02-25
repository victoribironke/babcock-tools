import HeadTemplate from "@/components/general/HeadTemplate";
import PageLoader from "@/components/general/PageLoader";
import { checkAuthentication } from "@/components/hoc/ProtectedRoute";
import { PAGES } from "@/constants/pages";
import { auth, db } from "@/services/firebase";
import { Deliverer, Order, User } from "@/types/dashboard";
import {
  formatNumber,
  getFreeOrdersForToday,
  getOrdersByMealType,
  getTodaysDate,
  getUsersByHall,
  parseDate,
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
  const [deliverers, setDeliverers] = useState<Deliverer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const freeOrders = getFreeOrdersForToday(
    orders.filter((o) => o.ticket_date === getTodaysDate() && o.is_free),
    deliverers
  );

  useEffect(() => {
    if (auth.currentUser?.uid !== "h8o1yv93IdRAls2euKGINJ6qGzj2") {
      router.push(PAGES.dashboard);
    }

    const unsubDeliverer = onSnapshot(
      query(collection(db, "deliverers")),
      (querySnapshot) => {
        setLoading(true);
        const temp_deliverers: Deliverer[] = [];

        querySnapshot.forEach((doc) => {
          temp_deliverers.push(doc.data() as Deliverer);
        });

        setDeliverers(temp_deliverers);
        setLoading(false);
      }
    );

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
      unsubDeliverer();
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

        <p className="text-lg mb-2 font-medium">
          Free orders for {parseDate(getTodaysDate()) as string}
        </p>

        <div className="overflow-x-scroll rounded-lg mb-4 border-2 grid grid-cols-1">
          <table className="w-full text-left rtl:text-right">
            <thead className="border-b-2">
              <tr>
                <th
                  scope="col"
                  className="pl-4 pr-2 py-3 font-medium whitespace-nowrap"
                >
                  Deliverer&apos;s name
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 font-medium whitespace-nowrap"
                >
                  Email address
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 font-medium whitespace-nowrap"
                >
                  Bank name
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 font-medium whitespace-nowrap"
                >
                  Account number
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 font-medium whitespace-nowrap"
                >
                  Account name
                </th>
                <th
                  scope="col"
                  className="pl-2 pr-4 py-3 font-medium whitespace-nowrap"
                >
                  Amount
                </th>
              </tr>
            </thead>
            {freeOrders.length > 0 && (
              <tbody>
                {freeOrders.map((f, i) => (
                  <tr className="bg-white border-b text-sm" key={i}>
                    <td className="pl-4 pr-2 py-3 whitespace-nowrap">
                      {f.deliverers_name}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">{f.email}</td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      {f.bank_details?.bank_name}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      {f.bank_details?.account_number}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">
                      {f.bank_details?.account_name}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap">{f.amount}</td>
                  </tr>
                ))}
              </tbody>
            )}{" "}
          </table>

          {freeOrders.length === 0 && (
            <p className="w-full text-center my-4 text-gray-400 text-sm">
              There are no free orders for today.
            </p>
          )}
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
