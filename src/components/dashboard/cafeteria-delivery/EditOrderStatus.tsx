import { edit_order_status } from "@/atoms/atoms";
import { db } from "@/services/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSetRecoilState } from "recoil";

const EditOrderStatus = ({ id }: { id: string }) => {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const setEditOrderStatus = useSetRecoilState(edit_order_status);

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

  return (
    <>
      <p className="w-full">
        Change the status of the order to &apos;Delivered&apos;?{" "}
        <span className="font-medium">
          You won&apos;t be able edit it again.
        </span>
      </p>

      <div className="mt-4 flex gap-2 items-center justify-center">
        <button
          className="w-full bg-red py-2 text-white rounded-md"
          onClick={() => setEditOrderStatus("")}
        >
          Cancel
        </button>
        <button
          disabled={disabled}
          onClick={changeStatus}
          className="w-full bg-blue py-2 text-white rounded-md disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
        >
          Change status
          {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
        </button>
      </div>
    </>
  );
};

export default EditOrderStatus;
