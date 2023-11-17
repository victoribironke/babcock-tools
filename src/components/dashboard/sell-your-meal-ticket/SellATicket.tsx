import {
  DateInput,
  NumberInput,
  SelectInput,
} from "@/components/general/Input";
import { ATicket } from "@/types/dashboard";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import toast from "react-hot-toast";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "@/services/firebase";
import { MEAL_TYPES } from "@/constants/babcock";

const SellATicket = () => {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ATicket>({
    meal_type: "Breakfast",
    ticket_date: "",
    price: "",
  });

  const updateFormData = (text: string, which: string) => {
    setFormData((k) => {
      return { ...k, [which]: text };
    });
  };

  const saveTicket = async () => {
    const { ticket_date, price } = formData;

    if (!ticket_date) {
      toast.error("Please input a ticket date.");
      return;
    }

    if (!price) {
      toast.error("Please input a price.");
      return;
    }

    try {
      setLoading(true);
      setDisabled(true);

      const docRef = await addDoc(collection(db, "meal-tickets"), {
        ...formData,
        uid: auth.currentUser?.uid,
        sold: false,
      });

      await updateDoc(doc(db, "users", auth.currentUser?.uid!), {
        my_tickets: arrayUnion(docRef.id),
      });

      toast.success("Your ticket was saved.");
      setFormData({
        meal_type: "Breakfast",
        ticket_date: "",
        price: "",
      });
    } catch (e: any) {
      toast.error(`Error: ${e.code.split("/")[1]}.`);
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  };

  return (
    <div className="w-full max-w-sm mt-4">
      <p className="mb-1">Meal type</p>
      <SelectInput
        onChange={(e) => updateFormData(e.target.value, "meal_type")}
        value={formData.meal_type}
        options={MEAL_TYPES.map((a) => {
          return { value: a, text: a };
        })}
      />

      <p className="mb-1 mt-5">Ticket date</p>
      <DateInput
        onChange={(e) => updateFormData(e.target.value, "ticket_date")}
        value={formData.ticket_date}
      />

      <p className="mb-1 mt-5">Price (min. ₦300)</p>
      <NumberInput
        onChange={(e) => updateFormData(e.target.value, "price")}
        value={formData.price}
        placeholder="300"
        onBlur={() => {
          if (formData.price === "") return;

          if (parseInt(formData.price) < 300) updateFormData("300", "price");
        }}
      />

      <button
        disabled={disabled}
        onClick={saveTicket}
        className="w-full mt-4 bg-blue py-2.5 text-white rounded-md disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
      >
        Save
        {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
      </button>
    </div>
  );
};

export default SellATicket;
