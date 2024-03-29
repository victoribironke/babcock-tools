import HeadTemplate from "@/components/general/HeadTemplate";
import PageLoader from "@/components/general/PageLoader";
import { db } from "@/services/firebase";
import { Event } from "@/types/dashboard";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NotFound from "../404";
import EventInfo from "@/components/dashboard/events/EventInfo";
import EventForm from "@/components/dashboard/events/EventForm";
import Header from "@/components/general/Header";

const Event = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<Event>();

  useEffect(() => {
    let unsub;

    if (id) {
      const q = query(collection(db, "events"), where("id", "==", id));

      unsub = onSnapshot(q, (querySnapshot) => {
        setLoading(true);

        const full_events: Event[] = [];

        querySnapshot.forEach((doc) => {
          full_events.push(doc.data() as Event);
        });

        setEvent(full_events[0]);

        setLoading(false);
      });
    }

    return unsub;
  }, [router]);

  if (loading) return <PageLoader type="full" />;
  else if (!event?.public) return <NotFound />;

  return (
    <>
      <HeadTemplate title={event.name} />

      <Header />

      <section className="w-full max-w-5xl px-6 pb-12 flex flex-col md:flex-row gap-2">
        <div className="w-full md:w-2/3">
          <EventInfo event={event} />
        </div>
        <div className="w-full md:w-1/3 max-w-md self-start bg-white shadow-md border py-2 px-2.5 rounded-xl">
          <EventForm event={event} />
        </div>
      </section>
    </>
  );
};

export default Event;
