import { TextInput } from "@/components/general/Input";
import { db } from "@/services/firebase";
import { Event } from "@/types/dashboard";
import {
  getFeesFromTicketPrice,
  getTodaysDate,
  isValidEmail,
} from "@/utils/helpers";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const EventForm = ({ event }: { event: Event }) => {
  const price = parseInt(event.price_per_ticket);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    email_confirm: "",
  });
  const input_classes =
    "w-full border-2 border-blue outline-none py-1 px-2 rounded-lg bg-white";

  const updateFormData = (text: string, which: string) => {
    setFormData((k) => {
      return { ...k, [which]: text };
    });
  };

  const register = async () => {
    const { email, email_confirm, full_name } = formData;

    if (!full_name) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!email || !isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (email !== email_confirm) {
      toast.error("The emails do not match.");
      return;
    }

    try {
      setLoading(true);

      const { attendees, no_of_tickets, is_free, id } = event;

      if (no_of_tickets !== "Unlimited") {
        if (attendees >= parseInt(no_of_tickets)) {
          toast.error("There are no more tickets available for this event.");
          return;
        }
      }

      // If there is:
      //  - If the event is free, save the details in the backend, update the attendees list, show the success toast and send them an email with the ticket
      //  - If the event is paid, show the payment thingy, then do the steps above.

      if (!is_free) {
        // payment flow
      }

      const docRef = await addDoc(collection(db, "attendees"), {
        full_name,
        email,
        event_id: id,
        amount_paid: {
          ticket_price: is_free ? 0 : price,
          fee: is_free ? 0 : getFeesFromTicketPrice(price),
        },
        date_ordered: getTodaysDate(),
      });

      await updateDoc(doc(db, "attendees", docRef.id), {
        id: docRef.id,
      });

      await updateDoc(doc(db, "events", id), {
        attendees: attendees + 1,
      });

      // Send email with the ticket, have the ticket id in the email

      setFormData({ email: "", email_confirm: "", full_name: "" });
      toast.success("You have successfully registered.");
    } catch (e) {
      toast.error("An error occured.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="mb-4 text-lg font-medium">Register for this event</p>

      <p className="mb-1">Full name</p>
      <input
        type="text"
        className={input_classes}
        onChange={(e) => updateFormData(e.target.value, "full_name")}
        value={formData.full_name}
        placeholder="Full name"
      />

      <p className="mb-1 mt-2">Email address</p>
      <input
        type="text"
        className={input_classes}
        onChange={(e) => updateFormData(e.target.value, "email")}
        value={formData.email}
        placeholder="Email address"
      />

      <p className="mb-1 mt-2">Confirm email address</p>
      <input
        type="text"
        className={input_classes}
        onChange={(e) => updateFormData(e.target.value, "email_confirm")}
        value={formData.email_confirm}
        placeholder="Confirm email address"
      />

      <button
        className="w-full bg-blue rounded-lg text-white py-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        disabled={loading}
        onClick={register}
      >
        {event.is_free
          ? "Register"
          : `Pay ₦${price + getFeesFromTicketPrice(price)}`}
        {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
      </button>
    </>
  );
};

export default EventForm;
