import { TextInput } from "@/components/general/Input";
import PageLoader from "@/components/general/PageLoader";
import { db } from "@/services/firebase";
import { Attendee, Event } from "@/types/dashboard";
import {
  getFeesFromTicketPrice,
  getTodaysDate,
  isValidEmail,
} from "@/utils/helpers";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { usePaystackPayment } from "react-paystack";

const EventForm = ({ event }: { event: Event }) => {
  const price = parseInt(event.price_per_ticket);
  const [loading, setLoading] = useState(false);
  const [guests, setGuests] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    email_confirm: "",
  });
  const { attendees, no_of_tickets, is_free, id } = event;
  const input_classes =
    "w-full border-2 border-blue outline-none py-1 px-2 rounded-lg bg-white";
  const initializePayment = usePaystackPayment({
    email: formData.email,
    amount: (price + getFeesFromTicketPrice(price)) * 100,
    publicKey:
      process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_PAYSTACK_TEST_PUBLIC_KEY!
        : process.env.NEXT_PUBLIC_PAYSTACK_LIVE_PUBLIC_KEY!,
    subaccount: event.subaccount_code,
    transaction_charge: getFeesFromTicketPrice(price) * 100,
  });

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

    if (no_of_tickets !== "Unlimited") {
      if (attendees >= parseInt(no_of_tickets)) {
        toast.error("There are no more tickets available for this event.");
        return;
      }
    }

    const isUserRegistered = guests.find((g) => g.email === email);

    if (isUserRegistered) {
      toast.error("You have already registered for this event.");
      return;
    }

    try {
      setLoading(true);

      const addToDB = async () => {
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
      };

      if (!is_free) {
        const onSuccess = () => addToDB();

        const onClose = () => {
          toast.error("Payment cancelled.");
        };

        initializePayment(onSuccess, onClose);
      } else addToDB();
    } catch (e) {
      toast.error("An error occured.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "attendees"), where("event_id", "==", id));

    const unsub = onSnapshot(q, (querySnapshot) => {
      setIsLoading(true);

      const full_attendees: Attendee[] = [];

      querySnapshot.forEach((doc) => {
        full_attendees.push(doc.data() as Attendee);
      });

      setGuests(full_attendees);

      setIsLoading(false);
    });

    return unsub;
  }, []);

  if (isLoading) return <PageLoader type="small" />;

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
