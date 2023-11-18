import HeadTemplate from "@/components/general/HeadTemplate";
import { checkAuthentication } from "@/components/hoc/ProtectedRoute";
import DashboardTemplate from "@/components/dashboard/DashboardTemplate";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "@/services/firebase";
import PageLoader from "@/components/general/PageLoader";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, "meal-tickets"),
      where("sold", "==", true),
      where("uid", "==", auth.currentUser?.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setLoading(true);

      let full_tickets = 0;

      querySnapshot.forEach(() => {
        full_tickets += 1;
      });

      setLoading(false);

      setTickets(full_tickets);
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <HeadTemplate title="Dashboard" />

      <DashboardTemplate>
        {loading && <PageLoader type="small" />}

        {!loading && (
          <div className="p-4 w-fit rounded-lg border bg-white">
            <p className="text-lg sm:text-xl font-medium">Tickets sold</p>

            <div className="w-full text-center text-3xl sm:text-4xl font-semibold mt-4 text-blue">
              {tickets}
            </div>
          </div>
        )}
      </DashboardTemplate>
    </>
  );
};

export default checkAuthentication(Dashboard);
