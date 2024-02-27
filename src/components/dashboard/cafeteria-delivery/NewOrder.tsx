import { DateInput, SelectInput, TextInput } from "@/components/general/Input";
import { MEAL_TYPES } from "@/constants/babcock";
import { auth, db } from "@/services/firebase";
import { Deliverer, NewOrderProps, Order } from "@/types/dashboard";
import {
  classNames,
  getFreeOrderStatus,
  getMealType,
  getTodaysDate,
  parseDate,
} from "@/utils/helpers";
import { useEffect, useState } from "react";
import { usePaystackPayment } from "react-paystack";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { DAYS } from "@/constants/dashboard";
import Link from "next/link";
import { PAGES } from "@/constants/pages";

const NewOrder = ({ setTab, deliverers, orders }: NewOrderProps) => {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>();
  const { free_order, orders_to_go } = getFreeOrderStatus(orders);
  const [formData, setFormData] = useState<Order>({
    meal_type: getMealType(),
    date_ordered: getTodaysDate(),
    deliverer_id: "",
    status: "Not delivered",
    ticket_date: getTodaysDate(),
    orderer_id: auth.currentUser?.uid!,
    room_number: "",
    amount_paid: { amount: "", charges: "100" },
    id: "", // meal_type, ticket_date, uid
    is_free: free_order,
  });
  const prices = deliverers.map((d) => {
    return { id: d.uid, price: d.amount_per_order };
  });
  const price = prices.find((p) => p.id === formData.deliverer_id);
  // const today = DAYS[new Date().getDay()];

  const doesTheDelivererHandleTheMealForToday = (d: Deliverer) => {
    const { meal_type, ticket_date } = formData;
    let arr: string[] = [];

    if (meal_type === "Breakfast") arr = d.schedule.breakfast;
    else if (meal_type === "Lunch") arr = d.schedule.lunch;
    else if (meal_type === "Dinner") arr = d.schedule.dinner;

    if (arr.includes(DAYS[new Date(ticket_date).getDay()])) return true;

    return false;
  };

  const initializePayment = usePaystackPayment({
    email: userInfo?.email,
    reference: formData.id,
    amount: (parseInt(price ? price.price : "0") + 100) * 100,
    publicKey:
      process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_PAYSTACK_TEST_PUBLIC_KEY!
        : process.env.NEXT_PUBLIC_PAYSTACK_LIVE_PUBLIC_KEY!,
    subaccount: deliverers.find((d) => d.uid === formData.deliverer_id)
      ?.subaccount_code,
    transaction_charge: 100 * 100,
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
        setDoc(doc(db, "orders", formData.id), formData)
          .then(() => {
            toast.success("Payment successful. Your order has been placed.");

            setLoading(false);
            setDisabled(false);
          })
          .then(() => {
            const email = deliverers.find(
              (d) => d.uid === formData.deliverer_id
            )?.email;
            const user_info = JSON.parse(localStorage.getItem("bt_user_info")!);

            fetch(
              `/api/send-order-notification?email=${email}&order_id=${formData.id}&full_name=${user_info.full_name}`
            )
              .then(() => setTab("past"))
              .catch(() => {});
          })
          .catch(() =>
            toast.error("An error occured while placing your order.")
          );
      };

      const onClose = () => {
        toast.error("Payment cancelled.");

        setLoading(false);
        setDisabled(false);
      };

      free_order ? onSuccess() : initializePayment(onSuccess, onClose);
    } catch (e: any) {
      toast.error("An error occured.");
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  };

  useEffect(() => {
    setUserInfo(JSON.parse(localStorage.getItem("bt_user_info")!));

    setFormData((k) => {
      return {
        ...k,
        amount_paid: { ...k.amount_paid, amount: price ? price.price : "0" },
      };
    });
  }, [price]);

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
    <>
      <p
        className={classNames(
          "mt-4 py-1 px-3 rounded-md text-white",
          free_order ? "bg-green" : "bg-blue"
        )}
      >
        {free_order
          ? "You have a free order"
          : `Free order in ${orders_to_go} orders`}
      </p>

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
          If the dropdown below is empty, it means that there are no deliverers
          in your hostel or no deliverer handles the meal type you selected on
          this day.
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
              .filter(
                (a) =>
                  a.max_number_of_orders !== "0" &&
                  doesTheDelivererHandleTheMealForToday(a)
              )
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

        <p className="mb-2 mt-4 text-sm text-gray-500">
          If the button below is greyed out, it means the time for ordering the
          meal you selected on the ticket&apos;s date has passed.{" "}
          <Link
            href={PAGES.cafeteria_delivery_instructions}
            className="text-blue"
            target="_blank"
          >
            Learn more
          </Link>
        </p>
        <button
          disabled={disabled}
          onClick={placeOrder}
          className="w-full mt- bg-blue py-2.5 text-white rounded-md disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
        >
          Place order
          {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
        </button>
      </div>
    </>
  );
};

export default NewOrder;
