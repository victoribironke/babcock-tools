import HeadTemplate from "@/components/general/HeadTemplate";
import PageLoader from "@/components/general/PageLoader";
import { checkAuthentication } from "@/components/hoc/ProtectedRoute";
import { PAGES } from "@/constants/pages";
import { auth, db } from "@/services/firebase";
import { Deliverer, Order } from "@/types/dashboard";
import { getTodaysDate, parseDate } from "@/utils/helpers";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AdminPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  //   const [deliverers, setDeliverers] = useState<Deliverer[]>([]);
  //   const [orders, setOrders] = useState<Order[]>([]);
  //   const [summary, setSummary] = useState<Summary[]>([]);

  //   useEffect(() => {
  //     const grouped_data = orders.reduce((group, order) => {
  //       const { deliverer_id } = order;

  //       group[deliverer_id as keyof typeof group] =
  //         group[deliverer_id as keyof typeof group] ?? [];

  //       (group[deliverer_id as keyof typeof group] as Order[]).push(order);

  //       return group;
  //     }, {}); // Group orders according to their deliverer

  //     const arr: Order[][] = [];

  //     for (let i in grouped_data) {
  //       arr.push(grouped_data[i as keyof typeof grouped_data]);
  //     }

  //     const new_arr = arr.map((a) => {
  //       return {
  //         deliverers_name: deliverers.find((d) => d.uid === a[0].deliverer_id)
  //           ?.full_name,
  //         breakfast: a.reduce((c, d) => {
  //           if (d.meal_type === "Breakfast") c += 1;
  //           return c;
  //         }, 0),
  //         lunch: a.reduce((c, d) => {
  //           if (d.meal_type === "Lunch") c += 1;
  //           return c;
  //         }, 0),
  //         dinner: a.reduce((c, d) => {
  //           if (d.meal_type === "Dinner") c += 1;
  //           return c;
  //         }, 0),
  //       };
  //     });

  //     setSummary(new_arr);
  //   }, [orders]);

  useEffect(() => {
    if (auth.currentUser?.uid !== "h8o1yv93IdRAls2euKGINJ6qGzj2") {
      router.push(PAGES.dashboard);
    }

    // const q1 = query(
    //   collection(db, "orders"),
    //   where("ticket_date", "==", getTodaysDate())
    // );

    // const q2 = query(collection(db, "deliverers"));

    // const unsubOrders = onSnapshot(q1, (querySnapshot) => {
    //   setLoading(true);
    //   const temp_orders: Order[] = [];

    //   querySnapshot.forEach((doc) => {
    //     temp_orders.push(doc.data() as Order);
    //   });

    //   setOrders(temp_orders);
    //   setLoading(false);
    // });

    // const unsubDeliverers = onSnapshot(q2, (querySnapshot) => {
    //   setLoading(true);

    //   const temp_deliverers: Deliverer[] = [];

    //   querySnapshot.forEach((doc) => {
    //     temp_deliverers.push(doc.data() as Deliverer);
    //   });

    //   setDeliverers(temp_deliverers);
    //   setLoading(false);
    // });

    // return () => {
    //   unsubOrders();
    //   unsubDeliverers();
    // };
  }, []);

  if (loading) return <PageLoader type="full" />;

  return (
    <>
      <HeadTemplate title="Admin" />

      <p>Order summary for today: {parseDate(getTodaysDate()) as string}</p>

      <div className="overflow-x-scroll max-w-3xl shadow-md rounded-lg mt-6 border grid grid-cols-1">
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
                Breakfast
              </th>
              <th
                scope="col"
                className="px-2 py-3 font-medium whitespace-nowrap"
              >
                Lunch
              </th>
              <th
                scope="col"
                className="px-2 py-3 font-medium whitespace-nowrap"
              >
                Dinner
              </th>
              <th
                scope="col"
                className="px-2 py-3 font-medium whitespace-nowrap"
              >
                Amount paid
              </th>
              <th scope="col" className="pl-2 pr-4 py-3 font-medium">
                Amount due
              </th>
            </tr>
          </thead>

          {/* {summary.length > 0 && (
            <tbody>
              {summary.map((s, i) => (
                <tr className="bg-white border-b text-sm" key={i}>
                  <td className="pl-4 pr-2 py-3 whitespace-nowrap">
                    {s.deliverers_name}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">{s.breakfast}</td>
                  <td className="px-2 py-3 whitespace-nowrap">{s.lunch}</td>
                  <td className="px-2 py-3 whitespace-nowrap">{s.dinner}</td>
                  <td className="px-2 py-3 whitespace-nowrap"></td>
                  <td className="pl-2 pr-4 py-3 whitespace-nowrap"></td>
                </tr>
              ))}
            </tbody>
          )} */}
        </table>

        {/* {summary.length === 0 && (
          <p className="w-full text-center my-4 text-gray-400 text-sm">
            You have no orders for today.
          </p>
        )} */}
      </div>
    </>
  );
};
export default checkAuthentication(AdminPage);
