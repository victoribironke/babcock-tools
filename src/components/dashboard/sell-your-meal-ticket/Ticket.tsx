import { auth, db } from "@/services/firebase";
import { TicketProps } from "@/types/dashboard";
import { classNames, formatNumber, parseDate } from "@/utils/helpers";
import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { IoTicketOutline } from "react-icons/io5";
import toast from "react-hot-toast";

const Ticket = ({ ticket }: TicketProps) => {
  const markAndUnmark = async () => {
    try {
      await updateDoc(doc(db, "meal-tickets", ticket.id!), {
        sold: !ticket?.sold,
      });

      toast.success("Ticket updated.");
    } catch (e: any) {
      toast.error(`Error: ${e.code.split("/")[1]}`);
    }
  };

  const deleteTicket = async () => {
    try {
      await deleteDoc(doc(db, "meal-tickets", ticket.id!));

      await updateDoc(doc(db, "users", auth.currentUser?.uid!), {
        my_tickets: arrayRemove(ticket.id),
      });

      toast.success("Ticket deleted.");
    } catch (e: any) {
      toast.error(`Error: ${e.code.split("/")[1]}`);
    }
  };

  return (
    <div className="bg-white shadow-md border rounded-lg p-2 flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="bg-opacity-10 p-3.5 rounded-md text-4xl bg-yellow text-yellow">
          <IoTicketOutline />
        </div>

        <div className="flex flex-col justify-between">
          <div className="flex gap-1 text-sm">
            <p className="opacity-70">For:</p>
            <p>{ticket.meal_type}</p>
          </div>

          <div className="flex gap-1 text-sm">
            <p className="opacity-70">On:</p>
            <p>{parseDate(ticket.ticket_date) as string}</p>
          </div>

          <div className="flex gap-1 text-sm">
            <p className="opacity-70">Price:</p>
            <p>₦{formatNumber(parseInt(ticket.price))}</p>
          </div>
        </div>
      </div>

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
  );
};

export default Ticket;
