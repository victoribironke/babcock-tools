import DashboardTemplate from "@/components/dashboard/DashboardTemplate";
import SellATicket from "@/components/dashboard/sell-your-meal-ticket/SellATicket";
import YourTickets from "@/components/dashboard/sell-your-meal-ticket/YourTickets";
import HeadTemplate from "@/components/general/HeadTemplate";
import { checkAuthentication } from "@/components/hoc/ProtectedRoute";
import { auth, db } from "@/services/firebase";
import { ATicket } from "@/types/dashboard";
import { classNames } from "@/utils/helpers";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

const SellYourMealTicketPage = () => {
  const [tab, setTab] = useState<"see" | "sell">("see");
  const [loading, setLoading] = useState(true);
  const [noTickets, setNoTickets] = useState(false);
  const [tickets, setTickets] = useState<ATicket[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "meal-tickets"),
      where("uid", "==", auth.currentUser?.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setLoading(true);

      const full_tickets: ATicket[] = [];

      querySnapshot.forEach((doc) => {
        full_tickets.push({ id: doc.id, ...(doc.data() as any) });
      });

      setLoading(false);

      if (full_tickets.length === 0) {
        setNoTickets(true);
        return;
      }

      setNoTickets(false);
      setTickets(full_tickets);
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <HeadTemplate title="Sell your meal ticket" />

      <DashboardTemplate>
        <div className="w-fit flex items-center p-1 justify-center rounded-full bg-gray-100">
          <button
            className={classNames(
              "rounded-full py-2 px-4",
              tab === "see" && "bg-white"
            )}
            onClick={() => setTab("see")}
          >
            Your tickets
          </button>
          <button
            className={classNames(
              "rounded-full py-2 px-4",
              tab === "sell" && "bg-white"
            )}
            onClick={() => setTab("sell")}
          >
            Sell a ticket
          </button>
        </div>

        {tab === "see" && (
          <YourTickets
            loading={loading}
            noTickets={noTickets}
            tickets={tickets}
          />
        )}
        {tab === "sell" && <SellATicket />}
      </DashboardTemplate>
    </>
  );
};

export default checkAuthentication(SellYourMealTicketPage);
