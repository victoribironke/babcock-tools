import Count from "@/components/dashboard/admin/Count";
import DeliverersSummary from "@/components/dashboard/admin/DeliverersSummary";
import EventsSummary from "@/components/dashboard/admin/EventsSummary";
import FreeOrders from "@/components/dashboard/admin/FreeOrders";
import OrdersByMealType from "@/components/dashboard/admin/OrdersByMealType";
import UsersByHall from "@/components/dashboard/admin/UsersByHall";
import HeadTemplate from "@/components/general/HeadTemplate";
import PageLoader from "@/components/general/PageLoader";
import { checkAuthentication } from "@/components/hoc/ProtectedRoute";
import { PAGES } from "@/constants/pages";
import { auth, db } from "@/services/firebase";
import { Deliverer, Event, Order, Summary, User } from "@/types/dashboard";
import { getFreeOrdersForToday, getTodaysDate } from "@/utils/helpers";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AdminPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showToday, setShowToday] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [summary, setSummary] = useState<Summary[]>([]);
  const [deliverers, setDeliverers] = useState<Deliverer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const freeOrders = getFreeOrdersForToday(
    orders.filter((o) => o.ticket_date === getTodaysDate() && o.is_free),
    deliverers
  );

  useEffect(() => {
    const grouped_data = (
      showToday
        ? orders.filter((o) => o.ticket_date === getTodaysDate())
        : orders
    ).reduce((group, order) => {
      const { deliverer_id } = order;

      group[deliverer_id as keyof typeof group] =
        group[deliverer_id as keyof typeof group] ?? [];

      (group[deliverer_id as keyof typeof group] as Order[]).push(order);

      return group;
    }, {}); // Group orders according to their deliverer

    const arr: Array<Order[]> = [];

    for (let i in grouped_data) {
      arr.push(grouped_data[i as keyof typeof grouped_data]);
    }

    const new_arr: Summary[] = arr.map((a) => {
      const d = deliverers.find((d) => d.uid === a[0].deliverer_id)!;
      const delivered = a.filter((c) => c.status === "Delivered");
      const not_delivered = a.filter(
        (c) => c.status === "Not delivered"
      ).length;
      const cancelled = a.filter((c) => c.status === "Cancelled").length;
      const amount_due = delivered.reduce(
        (c, d) => c + parseInt(d.amount_paid.amount),
        0
      );

      return {
        deliverers_name: d.full_name ?? "[Deleted]",
        orders: a.length,
        delivered: delivered.length,
        not_delivered,
        cancelled,
        hostel: d.hall_of_residence ?? "[Deleted]",
        bank_details: {
          account_name: d.bank_account_details.account_name ?? "[Deleted]",
          account_number: d.bank_account_details.account_number ?? "[Deleted]",
          bank_name: d.bank_account_details.bank_name ?? "[Deleted]",
        },
        email: d.email,
        amount_due,
      };
    });

    setSummary(new_arr);
  }, [orders, showToday]);

  useEffect(() => {
    if (auth.currentUser?.uid !== "h8o1yv93IdRAls2euKGINJ6qGzj2") {
      router.push(PAGES.dashboard);
    }

    const unsubEvents = onSnapshot(
      query(collection(db, "events")),
      (querySnapshot) => {
        setLoading(true);
        const temp_events: Event[] = [];

        querySnapshot.forEach((doc) => {
          temp_events.push(doc.data() as Event);
        });

        setEvents(temp_events);
        setLoading(false);
      }
    );

    const unsubDeliverers = onSnapshot(
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
      unsubDeliverers();
      unsubEvents();
    };
  }, []);

  if (loading) return <PageLoader type="full" />;

  return (
    <>
      <HeadTemplate title="Admin" />

      <section className="flex w-full flex-col max-w-6xl">
        <Count orders={orders.length} users={users.length} />

        <EventsSummary events={events} />

        <FreeOrders freeOrders={freeOrders} />

        <DeliverersSummary
          setShowToday={setShowToday}
          showToday={showToday}
          summary={summary}
        />

        <UsersByHall users={users} />

        <OrdersByMealType orders={orders} />
      </section>
    </>
  );
};
export default checkAuthentication(AdminPage);
