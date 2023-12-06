import HeadTemplate from "@/components/general/HeadTemplate";
import { checkAuthentication } from "@/components/hoc/ProtectedRoute";
import DashboardTemplate from "@/components/dashboard/DashboardTemplate";
import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "@/services/firebase";
import PageLoader from "@/components/general/PageLoader";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState(0);
  const [flashcards, setFlashcards] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, "meal-tickets"),
      where("sold", "==", true),
      where("uid", "==", auth.currentUser?.uid)
    );

    setLoading(true);

    const unsubscribeTickets = onSnapshot(q, (querySnapshot) => {
      let full_tickets = 0;

      querySnapshot.forEach(() => {
        full_tickets += 1;
      });

      setTickets(full_tickets);
    });

    const unsubscribeFlashcards = onSnapshot(
      doc(db, "flashcards", auth.currentUser!.uid),
      (doc) => {
        if (!doc.exists()) {
          setFlashcards(0);
          return;
        }

        const temp_cards: number[] = [];

        const flashcards = doc.data();
        for (let i in flashcards) {
          temp_cards.push(flashcards[i].length);
        }

        const total = temp_cards.reduce((a, b) => a + b, 0);

        setFlashcards(total);
      }
    );

    setLoading(false);

    return () => {
      unsubscribeTickets();
      unsubscribeFlashcards();
    };
  }, []);

  return (
    <>
      <HeadTemplate title="Dashboard" />

      <DashboardTemplate>
        {loading && <PageLoader type="small" />}

        {!loading && (
          <div className="w-full flex flex-wrap items-center justify-center gap-2">
            <div className="p-4 w-fit rounded-lg border bg-white">
              <p className="text-lg sm:text-xl font-medium">Tickets sold</p>

              <div className="w-full text-center text-3xl sm:text-4xl font-semibold mt-4 text-blue">
                {tickets}
              </div>
            </div>

            <div className="p-4 w-fit rounded-lg border bg-white">
              <p className="text-lg sm:text-xl font-medium">Flashcards</p>

              <div className="w-full text-center text-3xl sm:text-4xl font-semibold mt-4 text-blue">
                {flashcards}
              </div>
            </div>
          </div>
        )}
      </DashboardTemplate>
    </>
  );
};

export default checkAuthentication(Dashboard);
