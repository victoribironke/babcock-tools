import EventCard from "@/components/dashboard/events/EventCard";
import HeadTemplate from "@/components/general/HeadTemplate";
import Header from "@/components/general/Header";
import PageLoader from "@/components/general/PageLoader";
import { PAGES } from "@/constants/pages";
import { db } from "@/services/firebase";
import { Event } from "@/types/dashboard";
import { classNames } from "@/utils/helpers";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";

const Events = () => {
  const [tab, setTab] = useState<"past" | "coming">("coming");
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const filtered_events = events.filter((e) => {
    const now = new Date().getTime();
    const event = new Date(e.date_time).getTime();

    return tab === "coming" ? event > now : now > event;
  });

  useEffect(() => {
    const q = query(collection(db, "events"), where("public", "==", true));

    const unsub = onSnapshot(q, (querySnapshot) => {
      setLoading(true);

      const full_events: Event[] = [];

      querySnapshot.forEach((doc) => {
        full_events.push(doc.data() as Event);
      });

      setEvents(full_events);

      setLoading(false);
    });

    return unsub;
  }, []);

  if (loading) return <PageLoader type="full" />;

  return (
    <>
      <HeadTemplate title="Events" />

      <Header />

      <section className="w-full max-w-5xl px-6 pb-12">
        <div className="w-full flex gap-2 items-center justify-center flex-wrap rs:flex-nowrap">
          <button
            className={classNames(
              "flex py-1 px-3 rounded-md w-fit",
              tab === "coming" ? "bg-blue text-white" : "bg-gray-300"
            )}
            onClick={() => setTab("coming")}
          >
            Upcoming events
          </button>
          <button
            className={classNames(
              "flex py-1 px-3 rounded-md w-fit rs:mr-auto",
              tab === "past" ? "bg-blue text-white" : "bg-gray-300"
            )}
            onClick={() => setTab("past")}
          >
            Past events
          </button>
        </div>

        <div className="mt-6 w-full max-w-5xl flex justify-center md:justify-start flex-wrap gap-6">
          {filtered_events.map((e, i) => (
            <EventCard event={e} key={i} />
          ))}
        </div>

        {filtered_events.length === 0 && (
          <p className="w-full text-center mt-4 text-gray-400">
            There are no events.
          </p>
        )}
      </section>
    </>
  );
};

export default Events;
