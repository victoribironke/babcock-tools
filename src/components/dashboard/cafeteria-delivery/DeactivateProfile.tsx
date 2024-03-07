import { deactivate_deliverer_profile } from "@/atoms/atoms";
// import { PAGES } from "@/constants/pages";
import { auth, db } from "@/services/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRecoilState } from "recoil";

const DeleteProfile = () => {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [deactivateDelivererProfile, setDeactivateDelivererProfile] =
    useRecoilState(deactivate_deliverer_profile);

  const deactivateProfile = async () => {
    try {
      setDisabled(true);
      setLoading(true);

      // const user_info = JSON.parse(localStorage.getItem("bt_user_info")!);

      // const req = await fetch(
      //   `https://api.paystack.co/subaccount/${deactivateDelivererProfile}`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_LIVE_SECRET_KEY}`,
      //       "Content-Type": "application/json",
      //     },
      //     method: "PUT",
      //     body: JSON.stringify({
      //       active: false,
      //     }),
      //   }
      // );
      // const data = await req.json();

      // if (!data.status) {
      //   toast.error("An error occured.");
      //   return;
      // }

      await updateDoc(doc(db, "deliverers", auth.currentUser?.uid!), {
        max_number_of_orders: "0",
      });

      // await updateDoc(doc(db, "users", auth.currentUser?.uid!), {
      //   is_deliverer: false,
      // });

      toast.success("Profile de-activated.");
      // localStorage.setItem(
      //   "bt_user_info",
      //   JSON.stringify({
      //     ...user_info,
      //     is_deliverer: false,
      //   })
      // );
      // router.push(PAGES.cafeteria_delivery);
      // router.reload();
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
        Are you sure you want to de-activate your deliverer profile? You can
        always re-activate it and recover your orders.
      </p>

      <div className="mt-4 flex gap-2 items-center justify-center">
        <button
          className="w-full bg-blue py-2 text-white rounded-md"
          onClick={() => setDeactivateDelivererProfile("")}
        >
          Cancel
        </button>
        <button
          disabled={disabled}
          onClick={deactivateProfile}
          className="w-full bg-red py-2 text-white rounded-md disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
        >
          Delete
          {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
        </button>
      </div>
    </>
  );
};

export default DeleteProfile;
