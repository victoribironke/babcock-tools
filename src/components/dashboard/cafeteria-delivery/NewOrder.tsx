import { DateInput, SelectInput } from "@/components/general/Input";
import { MEAL_TYPES } from "@/constants/babcock";
import { auth } from "@/services/firebase";
import { Order } from "@/types/dashboard";
import { getTodaysDate } from "@/utils/helpers";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const NewOrders = ({
  setTab,
}: {
  setTab: Dispatch<SetStateAction<"new" | "past">>;
}) => {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Order>({
    meal_type: "Breakfast",
    date_ordered: getTodaysDate(),
    deliverer: { id: "", name: "" },
    status: "Not delivered",
    ticket_date: "",
    id: "", // meal_type, date_ordered, ticket_date, uid
  });

  const updateFormData = (text: string, which: string) => {
    setFormData((k) => {
      return { ...k, [which]: text };
    });
  };

  const placeOrder = async () => {
    const { ticket_date } = formData;

    if (!ticket_date) {
      toast.error("Please input a ticket date.");
      return;
    }

    // - get all rider's details
    // - check if there is a rider is in the same hostel as the orderer
    // - if empty arry:
    //     - tell them there is no rider in their hostel
    // - else:
    //     - get all the riders that aren't fully booked
    //     - if empty array:
    //         - tell them all riders are booked
    //     - else:
    //         - get a random rider and place the order

    try {
      setLoading(true);
      setDisabled(true);

      //   const hall_of_owner = await (
      //     await getDoc(doc(db, "users", auth.currentUser?.uid!))
      //   ).data()?.hall_of_residence;

      //   const docRef = await addDoc(collection(db, "meal-tickets"), {
      //     ...formData,
      //     uid: auth.currentUser?.uid,
      //     sold: false,
      //     hall_of_owner,
      //   });

      //   await updateDoc(doc(db, "users", auth.currentUser?.uid!), {
      //     my_tickets: arrayUnion(docRef.id),
      //   });

      //   toast.success("Your ticket was saved.");
      setTab("past");
    } catch (e: any) {
      toast.error(`Error: ${e.code.split("/")[1]}.`);
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  };

  useEffect(() => {
    const { date_ordered, meal_type, ticket_date } = formData;

    setFormData((k) => {
      return {
        ...k,
        id: `${meal_type}_${date_ordered}_${ticket_date}_${auth.currentUser?.uid}`.toLowerCase(),
      };
    });
  }, [formData.date_ordered, formData.meal_type, formData.ticket_date]);

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

      <button
        disabled={disabled}
        onClick={placeOrder}
        className="w-full mt-4 bg-blue py-2.5 text-white rounded-md disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
      >
        Place order
        {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
      </button>
    </div>
  );
};

export default NewOrders;
