import { new_event } from "@/atoms/atoms";
import EventCard from "@/components/dashboard/events/EventCard";
import HeadTemplate from "@/components/general/HeadTemplate";
import PageLoader from "@/components/general/PageLoader";
import { checkAuthentication } from "@/components/hoc/ProtectedRoute";
import { auth, db } from "@/services/firebase";
import { Event } from "@/types/dashboard";
import { classNames } from "@/utils/helpers";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useSetRecoilState } from "recoil";

const EventsDashboard = () => {
  const [tab, setTab] = useState<"coming" | "past">("coming");
  const setNewEvent = useSetRecoilState(new_event);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const filtered_events = events.filter((e) => {
    const now = new Date().getTime();
    const event = new Date(e.date_time).getTime();

    return tab === "coming" ? event > now : now > event;
  });

  useEffect(() => {
    const q = query(
      collection(db, "events"),
      where("creator", "==", auth.currentUser!.uid)
    );

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

      <div className="flex justify-between items-center w-full max-w-5xl">
        <p className="font-medium text-lg">My events</p>

        <button
          className="flex py-1 px-3 rounded-md w-fit bg-blue text-white items-center justify-center gap-1"
          onClick={() => setNewEvent(true)}
        >
          <FiPlus /> New event
        </button>
      </div>

      <div className="w-full max-w-5xl mt-4">
        <div className="w-fit flex items-center p-1 justify-center rounded-xl bg-gray-100">
          <button
            className={classNames(
              "rounded-lg py-2 px-4",
              tab === "coming" && "bg-white"
            )}
            onClick={() => setTab("coming")}
          >
            Upcoming
          </button>
          <button
            className={classNames(
              "rounded-lg py-2 px-4",
              tab === "past" && "bg-white"
            )}
            onClick={() => setTab("past")}
          >
            Past
          </button>
        </div>
      </div>

      <div className="mt-6 w-full max-w-5xl flex justify-center lg:justify-start flex-wrap gap-6">
        {filtered_events.map((e, i) => (
          <EventCard event={e} key={i} />
        ))}
      </div>

      {filtered_events.length === 0 && (
        <p className="text-gray-400">You have no events.</p>
      )}
    </>
  );
};

export default checkAuthentication(EventsDashboard);
