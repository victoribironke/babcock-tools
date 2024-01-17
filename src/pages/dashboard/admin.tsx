import HeadTemplate from "@/components/general/HeadTemplate";
import PageLoader from "@/components/general/PageLoader";
import { checkAuthentication } from "@/components/hoc/ProtectedRoute";
import { PAGES } from "@/constants/pages";
import { auth, db } from "@/services/firebase";
import { Deliverer, Order, Summary } from "@/types/dashboard";
import { formatNumber, getTodaysDate, parseDate } from "@/utils/helpers";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AdminPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [deliverers, setDeliverers] = useState<Deliverer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState<Summary[]>([]);

  useEffect(() => {
    const grouped_data = orders.reduce((group, order) => {
      const { deliverer_id } = order;

      group[deliverer_id as keyof typeof group] =
        group[deliverer_id as keyof typeof group] ?? [];

      (group[deliverer_id as keyof typeof group] as Order[]).push(order);

      return group;
    }, {}); // Group orders according to their deliverer

    const arr: Order[][] = [];

    for (let i in grouped_data) {
      arr.push(grouped_data[i as keyof typeof grouped_data]);
    }

    const new_arr: Summary[] = arr.map((a) => {
      const b = deliverers.find(
        (d) => d.uid === a[0].deliverer_id
      )!.bank_account_details;
      const delivered = a.filter((c) => c.status === "Delivered");
      const not_delivered = a.filter((c) => c.status === "Not delivered");
      const amount_due = delivered.reduce(
        (c, d) => c + parseInt(d.amount_paid.amount),
        0
      );
      const amount_paid = a.reduce(
        (c, d) =>
          c + parseInt(d.amount_paid.amount) + parseInt(d.amount_paid.charges),
        0
      );

      return {
        deliverers_name: deliverers.find((d) => d.uid === a[0].deliverer_id)!
          .full_name,
        orders: a.length,
        delivered: delivered.length,
        not_delivered: not_delivered.length,
        amount_due,
        amount_paid,
        profit: amount_paid - amount_due,
        account_name: b.account_name,
        account_number: b.account_number,
        bank_name: b.bank_name,
        email: deliverers.find((d) => d.uid === a[0].deliverer_id)!.email,
      };
    });

    setSummary(new_arr);
  }, [orders]);

  useEffect(() => {
    if (auth.currentUser?.uid !== "h8o1yv93IdRAls2euKGINJ6qGzj2") {
      router.push(PAGES.dashboard);
    }

    // setLoading(false);

    const q1 = query(
      collection(db, "orders"),
      where("ticket_date", "==", getTodaysDate())
    );

    const q2 = query(collection(db, "deliverers"));

    const unsubOrders = onSnapshot(q1, (querySnapshot) => {
      setLoading(true);
      const temp_orders: Order[] = [];

      querySnapshot.forEach((doc) => {
        temp_orders.push(doc.data() as Order);
      });

      setOrders(temp_orders);
      setLoading(false);
    });

    const unsubDeliverers = onSnapshot(q2, (querySnapshot) => {
      setLoading(true);

      const temp_deliverers: Deliverer[] = [];

      querySnapshot.forEach((doc) => {
        temp_deliverers.push(doc.data() as Deliverer);
      });

      setDeliverers(temp_deliverers);
      setLoading(false);
    });

    return () => {
      unsubOrders();
      unsubDeliverers();
    };
  }, []);

  if (loading) return <PageLoader type="full" />;

  return (
    <>
      <HeadTemplate title="Admin" />

      <p>Order summary for today: {parseDate(getTodaysDate()) as string}</p>

      <div className="overflow-x-scroll max-w-5xl shadow-md rounded-lg mt-6 border grid grid-cols-1">
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
                Orders (D) (ND)
              </th>
              <th
                scope="col"
                className="px-2 py-3 font-medium whitespace-nowrap"
              >
                Amount paid
              </th>
              <th
                scope="col"
                className="px-2 py-3 font-medium whitespace-nowrap"
              >
                Amount due
              </th>
              <th
                scope="col"
                className="px-2 py-3 font-medium whitespace-nowrap"
              >
                Profit
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
                Email
              </th>
            </tr>
          </thead>

          {summary.length > 0 && (
            <tbody>
              {summary.map((s, i) => (
                <tr className="bg-white border-b text-sm" key={i}>
                  <td className="pl-4 pr-2 py-3 whitespace-nowrap">
                    {s.deliverers_name}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {s.orders} ({s.delivered}) ({s.not_delivered})
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    ₦{formatNumber(s.amount_paid)}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    ₦{formatNumber(s.amount_due)}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    ₦{formatNumber(s.profit)}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">{s.bank_name}</td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {s.account_number}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {s.account_name}
                  </td>
                  <td className="pl-2 pr-4 py-3 whitespace-nowrap">
                    {s.email}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>

        {summary.length === 0 && (
          <p className="w-full text-center my-4 text-gray-400 text-sm">
            You have no orders for today.
          </p>
        )}

        {summary.length > 0 && (
          <div className="w-full py-3.5 px-4 text-sm flex items-center justify-center gap-4">
            <div className="flex items-center justify-center gap-1">
              <p>Total orders:</p>
              <span className="font-medium">{orders.length}</span>
            </div>

            <div className="flex items-center justify-center gap-1">
              <p>Total payment:</p>
              <span className="font-medium">
                ₦{formatNumber(summary.reduce((a, b) => a + b.amount_paid, 0))}
              </span>
            </div>

            <div className="flex items-center justify-center gap-1">
              <p>Total amount to be paid:</p>
              <span className="font-medium">
                ₦{formatNumber(summary.reduce((a, b) => a + b.amount_due, 0))}
              </span>
            </div>

            <div className="flex items-center justify-center gap-1">
              <p>Total profit:</p>
              <span className="font-medium">
                ₦{formatNumber(summary.reduce((a, b) => a + b.profit, 0))}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default checkAuthentication(AdminPage);
