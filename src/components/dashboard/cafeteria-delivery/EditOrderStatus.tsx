import { edit_order_status } from "@/atoms/atoms";
import { db } from "@/services/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSetRecoilState } from "recoil";

const EditOrderStatus = ({ code }: { code: string }) => {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const setEditOrderStatus = useSetRecoilState(edit_order_status);
  const id = code.split("|")[0];
  const action = code.split("|")[1];

  const changeStatus = async () => {
    try {
      setDisabled(true);
      setLoading(true);

      await updateDoc(doc(db, "orders", id), {
        status: "Delivered",
      });

      toast.success("Order updated.");
      setEditOrderStatus("");
    } catch (e: any) {
      toast.error("An error occured.");
    } finally {
      setDisabled(false);
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    try {
      setDisabled(true);
      setLoading(true);

      // give a refund
      // const req = await fetch("https://api.paystack.co/refund", {
      //   headers: {
      //     Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_LIVE_SECRET_KEY}`,
      //     "Content-Type": "application/json",
      //   },
      //   method: "POST",
      //   body: JSON.stringify({
      //     transaction: id,
      //   }),
      // });
      // const data = await req.json();

      // if (!data.status) {
      //   toast.error("An error occured.");
      //   return;
      // }

      await updateDoc(doc(db, "orders", id), {
        status: "Cancelled",
      });

      toast.success("Order cancelled.");
      setEditOrderStatus("");
    } catch (e: any) {
      toast.error("An error occured.");
    } finally {
      setDisabled(false);
      setLoading(false);
    }
  };

  return (
    <>
      {action === "status" && (
        <p className="w-full">
          Change the status of the order to &apos;Delivered&apos;?{" "}
          <span className="font-medium">
            You won&apos;t be able edit it again.
          </span>
        </p>
      )}

      {action === "cancel" && (
        <p className="w-full">
          Are you sure you want to cancel this order?{" "}
          <span className="font-medium">
            You won&apos;t be able edit it again and the orderer will be
            refunded.
          </span>
        </p>
      )}

      <div className="mt-4 flex gap-2 items-center justify-center">
        <button
          className="w-full bg-red py-2 text-white rounded-md"
          onClick={() => setEditOrderStatus("")}
        >
          Close
        </button>
        <button
          disabled={disabled}
          onClick={action === "status" ? changeStatus : cancelOrder}
          className="w-full py-2 text-white rounded-md disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2 bg-blue"
        >
          {action === "status" ? "Change status" : "Cancel order"}
          {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
        </button>
      </div>
    </>
  );
};

export default EditOrderStatus;
