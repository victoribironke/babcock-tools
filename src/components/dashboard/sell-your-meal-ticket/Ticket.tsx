import { db } from "@/services/firebase";
import { TicketProps } from "@/types/dashboard";
import { classNames, formatNumber, pickRandomFromArray } from "@/utils/helpers";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { IoTicketOutline } from "react-icons/io5";
import toast from "react-hot-toast";

const Ticket = ({ ticket }: TicketProps) => {
  const colors = ["blue", "red", "green"];
  const random_color = pickRandomFromArray(colors);
  const cls = `bg-${random_color} text-${random_color}`;

  const dt = new Date(ticket.ticket_date).toDateString().split(" ").slice(0, 3);
  const date = `${dt[0]}, ${dt[2]} ${dt[1]}`;

  const markAndUnmark = async () => {
    try {
      const tk = await (
        await getDoc(doc(db, "meal-tickets", ticket.id!))
      ).data();

      await updateDoc(doc(db, "meal-tickets", ticket.id!), {
        sold: !tk?.sold,
      });

      toast.success("Ticket updated.");
    } catch (e: any) {
      toast.error(`Error: ${e.code.split("/")[1]}`);
    }
  };

  const deleteTicket = async () => {
    try {
      await deleteDoc(doc(db, "meal-tickets", ticket.id!));

      toast.success("Ticket deleted.");
    } catch (e: any) {
      toast.error(`Error: ${e.code.split("/")[1]}`);
    }
  };

  return (
    <div className="bg-white shadow-md border rounded-lg p-2 flex gap-2 overflow-hidden group relative">
      <div
        className={classNames("bg-opacity-10 p-3.5 rounded-md text-4xl", cls)}
      >
        <IoTicketOutline />
      </div>

      <div className="flex flex-col justify-between">
        <div className="flex gap-1 text-sm">
          <p className="opacity-70">For:</p>
          <p>{ticket.meal_type}</p>
        </div>

        <div className="flex gap-1 text-sm">
          <p className="opacity-70">On:</p>
          <p>{date}</p>
        </div>

        <div className="flex gap-1 text-sm">
          <p className="opacity-70">Price:</p>
          <p>₦{formatNumber(parseInt(ticket.price))}</p>
        </div>
      </div>

      <div className="w-full h-full opacity-0 group-hover:opacity-100 flex items-center flex-col gap-1 justify-center bg-gray-300 bg-opacity-80 absolute left-0 top-0">
        <button
          className={classNames(
            "text-white rounded-md py-1 px-3",
            ticket.sold ? "bg-green" : "bg-yellow"
          )}
          onClick={markAndUnmark}
        >
          {ticket.sold ? "Unmark as sold" : "Mark as sold"}
        </button>
        <button
          className="bg-red text-white rounded-md py-1 px-3"
          onClick={deleteTicket}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Ticket;
