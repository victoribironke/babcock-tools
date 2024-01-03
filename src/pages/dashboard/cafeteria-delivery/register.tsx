import HeadTemplate from "@/components/general/HeadTemplate";
import { NumberInput } from "@/components/general/Input";
import { checkAuthentication } from "@/components/hoc/ProtectedRoute";
import { auth, db } from "@/services/firebase";
import { signOutUser } from "@/utils/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const RegisterAsADeliverer = () => {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    no_of_orders: "",
  });

  const updateFormData = (text: string, which: string) => {
    setFormData((k) => {
      return { ...k, [which]: text };
    });
  };

  const registerDeliverer = async () => {
    const { amount, no_of_orders } = formData;
    const user_info = JSON.parse(localStorage.getItem("bt_user_info")!);

    if (!amount || !no_of_orders) {
      toast.error("Please fill in all the fields.");
      return;
    }

    try {
      setLoading(true);
      setDisabled(true);

      const deliverer = await getDoc(
        doc(db, "deliverers", auth.currentUser?.uid!)
      );

      if (deliverer.exists()) {
        toast.error("You have created a deliverer profile already.");
        return;
      }

      await setDoc(doc(db, "deliverers", auth.currentUser?.uid!), {
        uid: auth.currentUser?.uid,
        amount_per_order: amount,
        max_number_of_orders: no_of_orders,
        email: user_info.email,
        full_name: user_info.full_name,
        hall_of_residence: user_info.hall_of_residence,
        matric_no: user_info.matric_no,
        phone_number: user_info.phone_number,
      });

      await updateDoc(doc(db, "users", auth.currentUser?.uid!), {
        is_deliverer: true,
      });

      toast.success("Your profile was created.");
      signOutUser();
    } catch (e: any) {
      toast.error(`Error: ${e.code.split("/")[1]}.`);
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  };

  return (
    <>
      <HeadTemplate title="Register as a deliverer" />

      <section className="w-full min-h-[calc(100vh-8rem)] sm:min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="max-w-sm w-full">
          <p className="text-2xl font-medium mb-2 text-blue">
            Register as a cafeteria deliverer
          </p>

          <p className="text-gray-500 mb-5">
            Your details from the current signed-in account will be used to
            create a deliverer profile for you which you can edit later.
          </p>

          <p className="text-lg mb-1">Max number of orders</p>
          <NumberInput
            onChange={(e) => updateFormData(e.target.value, "no_of_orders")}
            placeholder="Max number of orders you can take per meal time"
            value={formData.no_of_orders}
          />

          <p className="text-lg mb-1 mt-4">Amount</p>
          <NumberInput
            onChange={(e) => updateFormData(e.target.value, "amount")}
            placeholder="Amount per order"
            value={formData.amount}
          />

          <button
            disabled={disabled}
            onClick={registerDeliverer}
            className="w-full mt-4 bg-blue py-2.5 text-white rounded-md disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
          >
            Register
            {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
          </button>
        </div>
      </section>
    </>
  );
};

export default checkAuthentication(RegisterAsADeliverer);
