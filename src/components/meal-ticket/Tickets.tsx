import { db } from "@/services/firebase";
import { ATicket } from "@/types/dashboard";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { IoTicketOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import PageLoader from "../general/PageLoader";
import { formatNumber, shuffleArray } from "@/utils/helpers";
import { useSetRecoilState } from "recoil";
import { get_ticket_details } from "@/atoms/atoms";

const Tickets = () => {
  const setGetTicketDetails = useSetRecoilState(get_ticket_details);
  const [loading, setLoading] = useState(true);
  const [noTickets, setNoTickets] = useState(false);
  const [tickets, setTickets] = useState<ATicket[]>([]);

  const [page, setPage] = useState(1);

  const d = tickets.length / 15;
  const c = Number.isInteger(d)
    ? page !== Math.floor(d)
    : page !== Math.floor(d) + 1;

  useEffect(() => {
    const q = query(collection(db, "meal-tickets"), where("sold", "==", false));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setLoading(true);

      const full_tickets: ATicket[] = [];

      querySnapshot.forEach((document) => {
        // if (
        //   new Date(document.data().ticket_date).getTime() >
        //     new Date().getTime() ||
        //   new Date(document.data().ticket_date).toDateString() ===
        //     new Date().toDateString()
        // ) {

        // }
        full_tickets.push({
          id: document.id,
          ...(document.data() as any),
        });
      });

      setLoading(false);

      if (full_tickets.length === 0) {
        setNoTickets(true);
        return;
      }

      setNoTickets(false);
      setTickets(shuffleArray(full_tickets));
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <PageLoader type="small" />;
  }

  if (noTickets) {
    return (
      <p className="w-full text-center mt-10 opacity-70">
        There are no available tickets.
      </p>
    );
  }

  return (
    <>
      <section className="w-full flex items-center justify-center flex-wrap mt-10 gap-2">
        {tickets.slice(page * 15 - 15, page * 15).map((tk, i) => {
          const dt = new Date(tk.ticket_date)
            .toDateString()
            .split(" ")
            .slice(0, 3);
          const date = `${dt[0]}, ${dt[2]} ${dt[1]}`;

          return (
            <div
              key={i}
              className="bg-white shadow-md border rounded-lg p-2 flex flex-col gap-2"
            >
              <div className="flex gap-2">
                <div className="bg-opacity-10 p-3.5 rounded-md text-4xl grid place-items-center text-yellow bg-yellow">
                  <IoTicketOutline />
                </div>

                <div className="flex flex-col justify-between">
                  <div className="flex gap-1 text-sm">
                    <p className="opacity-70">For:</p>
                    <p>{tk.meal_type}</p>
                  </div>

                  <div className="flex gap-1 text-sm">
                    <p className="opacity-70">On:</p>
                    <p>{date}</p>
                  </div>

                  <div className="flex gap-1 text-sm">
                    <p className="opacity-70">Price:</p>
                    <p>₦{formatNumber(parseInt(tk.price))}</p>
                  </div>

                  <div className="flex gap-1 text-sm">
                    <p className="opacity-70">Owner&apos;s hostel:</p>
                    <p>{tk.hall_of_owner}</p>
                  </div>
                </div>
              </div>

              <button
                className="bg-green text-white rounded-md py-1 px-3"
                onClick={() => setGetTicketDetails({ ticket_id: tk.id! })}
              >
                Get owner&apos;s details
              </button>
            </div>
          );
        })}
      </section>

      {tickets.length > 0 && (
        <div className="border mt-4 rounded-lg p-4 flex items-center justify-center gap-2 flex-col rs:flex-row">
          <p className="text-sm rs:mr-auto">
            Showing {page * 15 - 14} to{" "}
            {c
              ? tickets.length < 15
                ? tickets.length
                : page * 15
              : tickets.length}{" "}
            of {tickets.length} results
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

export default Tickets;
