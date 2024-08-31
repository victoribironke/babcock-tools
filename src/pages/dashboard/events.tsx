import EventCard from "@/components/dashboard/events/EventCard";
import NewEvent from "@/components/dashboard/events/NewEvent";
import HeadTemplate from "@/components/general/HeadTemplate";
import PageLoader from "@/components/general/PageLoader";
import { auth, db } from "@/services/firebase";
import { Event } from "@/types/dashboard";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

const Events = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "events"),
      where("creator", "==", auth.currentUser?.uid)
    );

    const unsub = onSnapshot(q, (d) => {
      setEvents(d.docs.map((a) => a.data() as Event));

      setLoading(false);
    });

    return unsub;
  }, []);

  if (loading) return <PageLoader type="full" />;

  return (
    <>
      <HeadTemplate title="Events" />

      <section className="w-full max-w-[1280px] flex flex-col items-start gap-4">
        <NewEvent />

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center justify-center gap-4">
          {events.map((e, i) => (
            <EventCard event={e} key={i} />
          ))}
        </div>

        {events.length === 0 && (
          <div className="w-full flex items-center justify-center flex-col px-6 py-12 gap-8">
            <p className="text-gray-400">You do not have any events.</p>

            <NewEvent />
          </div>
        )}
      </section>
    </>
  );
};

export default Events;
