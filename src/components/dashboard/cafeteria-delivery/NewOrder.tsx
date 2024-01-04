import { DateInput, SelectInput, TextInput } from "@/components/general/Input";
import { MEAL_TYPES } from "@/constants/babcock";
import { auth, db } from "@/services/firebase";
import { Deliverer, NewOrderProps, Order } from "@/types/dashboard";
import { getTodaysDate, parseDate } from "@/utils/helpers";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { usePaystackPayment } from "react-paystack";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

const NewOrder = ({ setTab, deliverers }: NewOrderProps) => {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>();
  const [prices] = useState(
    deliverers.map((d) => {
      return { id: d.uid, price: d.amount_per_order };
    })
  );
  const [formData, setFormData] = useState<Order>({
    meal_type: "Breakfast",
    date_ordered: getTodaysDate(),
    deliverer_id: "",
    status: "Not delivered",
    ticket_date: "",
    orderer_id: auth.currentUser?.uid!,
    room_number: "",
    id: "", // meal_type, ticket_date, uid
  });
  const price = prices.find((p) => p.id === formData.deliverer_id);

  const initializePayment = usePaystackPayment({
    email: userInfo?.email,
    reference: new Date().getTime().toString(),
    amount: (parseInt(price ? price.price : "0") + 100) * 100,
    publicKey:
      process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_PAYSTACK_TEST_PUBLIC_KEY!
        : process.env.NEXT_PUBLIC_PAYSTACK_LIVE_PUBLIC_KEY!,
  });

  const updateFormData = (text: string, which: string) => {
    setFormData((k) => {
      return { ...k, [which]: text };
    });
  };

  const placeOrder = async () => {
    const { ticket_date, deliverer_id, room_number } = formData;

    if (!ticket_date) {
      toast.error("Please input a ticket date.");
      return;
    }

    if (!room_number) {
      toast.error("Please input your room number.");
      return;
    }

    if (!deliverer_id) {
      toast.error("Please select a deliverer.");
      return;
    }

    try {
      setLoading(true);
      setDisabled(true);

      const order = await getDoc(doc(db, "orders", formData.id));

      if (order.exists()) {
        toast.error(
          `You've already ordered for ${formData.meal_type} on ${parseDate(
            formData.ticket_date
          )}.`
        );
        return;
      }

      const q = query(
        collection(db, "orders"),
        where("meal_type", "==", formData.meal_type),
        where("ticket_date", "==", formData.ticket_date)
      );

      const data = (await getDocs(q)).docs.map((d) => d.data()) as Order[];

      const orders_for_selected_deliverer = data.filter(
        (d) => d.deliverer_id === formData.deliverer_id
      ).length;
      const deliverers_max_number_of_orders = parseInt(
        deliverers.find((d) => d.uid === formData.deliverer_id)
          ?.max_number_of_orders!
      );

      if (orders_for_selected_deliverer >= deliverers_max_number_of_orders) {
        toast.error("This deliverer is already fully booked.");
        return;
      }

      const onSuccess = () => {
        setDoc(doc(db, "orders", formData.id), formData).then(() => {
          setTab("past");
          toast.success("Payment successful. Your order has been placed.");

          setLoading(false);
          setDisabled(false);
        });
      };

      const onClose = () => {
        toast.error("Payment cancelled.");

        setLoading(false);
        setDisabled(false);
      };

      initializePayment(onSuccess, onClose);
    } catch (e: any) {
      toast.error("An error occured.");
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  };

  useEffect(
    () => setUserInfo(JSON.parse(localStorage.getItem("bt_user_info")!)),
    []
  );

  useEffect(() => {
    const { meal_type, ticket_date } = formData;

    setFormData((k) => {
      return {
        ...k,
        id: `${meal_type}_${ticket_date}_${auth.currentUser?.uid}`.toLowerCase(),
      };
    });
  }, [formData.date_ordered, formData.meal_type, formData.ticket_date]);

  return (
    <div className="w-full max-w-md mt-4">
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

      <p className="mb-1 mt-5">Room number</p>
      <TextInput
        onChange={(e) =>
          updateFormData(
            e.target.value.replace(" ", "").toUpperCase(),
            "room_number"
          )
        }
        value={formData.room_number}
        placeholder="Room number"
      />

      <p className="mb-1 mt-5">Select deliverer</p>
      <p className="mb-2 text-sm text-gray-500">
        If the dropdown below is empty, it means that there are no deliverers in
        your hostel or no deliverer handles the meal type you selected.
      </p>
      <SelectInput
        onChange={(e) => updateFormData(e.target.value, "deliverer_id")}
        value={formData.deliverer_id}
        options={[
          {
            value: "",
            text: "Select deliverer",
          },
          ...deliverers
            .filter((a) => a.meals_handled.includes(formData.meal_type))
            .map((a) => {
              return {
                value: a.uid,
                text: `${a.full_name} / ₦${
                  parseInt(a.amount_per_order) + 100
                } `,
              };
            }),
        ]}
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

export default NewOrder;
