import { event_details } from "@/atoms/atoms";
import PageLoader from "@/components/general/PageLoader";
import { db } from "@/services/firebase";
import { Attendee, Event } from "@/types/dashboard";
import { parseDate } from "@/utils/helpers";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

const EventDetails = () => {
  const event = useRecoilValue(event_details) as Event;
  const [loading, setLoading] = useState(true);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [page, setPage] = useState(1);

  const d = attendees.length / 10;
  const c = Number.isInteger(d)
    ? page !== Math.floor(d)
    : page !== Math.floor(d) + 1;

  useEffect(() => {
    const q = query(
      collection(db, "attendees"),
      where("event_id", "==", event.id)
    );

    const unsub = onSnapshot(q, (querySnapshot) => {
      setLoading(true);

      const full_attendees: Attendee[] = [];

      querySnapshot.forEach((doc) => {
        full_attendees.push(doc.data() as Attendee);
      });

      setAttendees(full_attendees);

      setLoading(false);
    });

    return unsub;
  }, []);

  if (loading) return <PageLoader type="full" />;

  return (
    <>
      <p className="text-xl font-medium">{event.name}</p>
      <p className="mt-1 text-gray-500">{event.description}</p>

      <p className="mt-6 mb-2 text-lg font-medium">Guest list</p>
      <div className="overflow-x-scroll rounded-lg border-2 grid grid-cols-1">
        <table className="w-full text-left rtl:text-right">
          <thead className="border-b-2">
            <tr>
              <th
                scope="col"
                className="pl-4 pr-2 py-3 font-medium whitespace-nowrap"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-2 py-3 font-medium whitespace-nowrap"
              >
                Email address
              </th>
              <th
                scope="col"
                className="px-2 py-3 font-medium whitespace-nowrap"
              >
                Order ID
              </th>
              <th
                scope="col"
                className="pl-2 pr-4 py-3 font-medium whitespace-nowrap"
              >
                Date registered
              </th>
            </tr>
          </thead>
          {attendees.length > 0 && (
            <tbody>
              {attendees.slice(page * 10 - 10, page * 10).map((a, i) => (
                <tr className="bg-white border-b text-sm" key={i}>
                  <td className="pl-4 pr-2 py-3 whitespace-nowrap">
                    {a.full_name}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">{a.email}</td>
                  <td className="px-2 py-3 whitespace-nowrap">{a.id}</td>
                  <td className="pl-2 pr-4 py-3 whitespace-nowrap">
                    {parseDate(a.date_ordered) as string}
                  </td>
                </tr>
              ))}
            </tbody>
          )}{" "}
        </table>

        {attendees.length === 0 && (
          <p className="w-full text-center my-4 text-gray-400 text-sm">
            There are no attendees for this event.
          </p>
        )}
      </div>

      {attendees.length > 0 && (
        <div className="flex items-center justify-center mt-4 gap-2 flex-col rs:flex-row">
          <p className="text-sm rs:mr-auto">
            Showing {page * 10 - 9} to{" "}
            {c
              ? attendees.length < 10
                ? attendees.length
                : page * 10
              : attendees.length}{" "}
            of {attendees.length} attendees
          </p>

          <div className="flex gap-2">
            <button
              className="text-sm border py-1.5 px-3 shadow rounded-md hover:shadow-md disabled:cursor-not-allowed"
              onClick={() => page !== 1 && setPage((p) => p - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <button
              className="text-sm border py-1.5 px-3 shadow rounded-md hover:shadow-md disabled:cursor-not-allowed"
              onClick={() => c && setPage((p) => p + 1)}
              disabled={!c}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EventDetails;
