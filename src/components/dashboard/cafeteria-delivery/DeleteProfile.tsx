import { delete_deliverer_profile } from "@/atoms/atoms";
import { auth, db } from "@/services/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSetRecoilState } from "recoil";

const DeleteProfile = () => {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const setDeleteDelivererProfile = useSetRecoilState(delete_deliverer_profile);
  const router = useRouter();

  const deleteProfile = async () => {
    try {
      setDisabled(true);
      setLoading(true);

      const user_info = JSON.parse(localStorage.getItem("bt_user_info")!);

      await deleteDoc(doc(db, "deliverers", auth.currentUser?.uid!));

      await updateDoc(doc(db, "users", auth.currentUser?.uid!), {
        is_deliverer: false,
      });

      toast.success("Profile deleted.");
      localStorage.setItem(
        "bt_user_info",
        JSON.stringify({
          ...user_info,
          is_deliverer: false,
        })
      );
      router.reload();
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
        Are you sure you want to delete your deliverer profile? You can always
        create it again and recover your orders.
      </p>

      <div className="mt-4 flex gap-2 items-center justify-center">
        <button
          className="w-full bg-blue py-2 text-white rounded-md"
          onClick={() => setDeleteDelivererProfile(false)}
        >
          Cancel
        </button>
        <button
          disabled={disabled}
          onClick={deleteProfile}
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