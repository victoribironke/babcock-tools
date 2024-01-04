import HeadTemplate from "@/components/general/HeadTemplate";
import {
  NumberInput,
  SelectInput,
  TextInput,
} from "@/components/general/Input";
import { checkAuthentication } from "@/components/hoc/ProtectedRoute";
import { BANKS } from "@/constants/banks";
import { auth, db } from "@/services/firebase";
import { DelivererDetailsProps } from "@/types/dashboard";
import { signOutUser } from "@/utils/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const DeliverersDetails = ({ deliverer }: DelivererDetailsProps) => {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bankCode, setBankCode] = useState(
    BANKS.find((b) => b.name === deliverer!.bank_account_details.bank_name)!
      .code
  );
  const [formData, setFormData] = useState({
    amount: deliverer!.amount_per_order,
    no_of_orders: deliverer!.max_number_of_orders,
    bank_account_details: {
      account_number: deliverer!.bank_account_details.account_number,
      bank_name: deliverer!.bank_account_details.bank_name,
      account_name: deliverer!.bank_account_details.account_name,
    },
  });

  const updateFormData = (text: string, which: string) => {
    setFormData((k) => {
      return { ...k, [which]: text };
    });
  };

  const registerDeliverer = async () => {
    const {
      amount,
      no_of_orders,
      bank_account_details: { account_number, bank_name, account_name },
    } = formData;
    const user_info = JSON.parse(localStorage.getItem("bt_user_info")!);

    if (
      !amount ||
      !no_of_orders ||
      !account_number ||
      !bank_name ||
      !account_name
    ) {
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
        bank_account_details: {
          account_number,
          bank_name,
          account_name,
        },
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

  const getAccountName = async () => {
    const {
      bank_account_details: { account_number },
    } = formData;

    if (!account_number || account_number.length < 10 || !bankCode) {
      toast.error("The account number or bank name is not correct.");
      return;
    }

    try {
      setIsLoading(true);
      setIsDisabled(true);

      const req = await fetch(
        `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bankCode}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_LIVE_SECRET_KEY}`,
          },
        }
      );
      const data = await req.json();

      if (!data.status) {
        toast.error("The account number or bank name is not correct.");
        return;
      }

      setFormData((k) => {
        return {
          ...k,
          bank_account_details: {
            ...k.bank_account_details,
            account_name: data.data.account_name,
            bank_name: BANKS.find((b) => b.code === bankCode)!.name,
          },
        };
      });
    } catch (e) {
      toast.error("An error occured.");
    } finally {
      setIsLoading(false);
      setIsDisabled(false);
    }
  };

  useEffect(() => {
    setFormData((k) => {
      return {
        ...k,
        bank_account_details: {
          ...k.bank_account_details,
          account_name: "",
        },
      };
    });
  }, [formData.bank_account_details.account_number, bankCode]);

  return (
    <div className="max-w-sm w-full my-4">
      <p className="text-2xl font-medium mb-2 text-blue">Edit your profile</p>

      <p className="mb-1">Max number of orders</p>
      <NumberInput
        onChange={(e) => updateFormData(e.target.value, "no_of_orders")}
        placeholder="Max number of orders you can take per meal time"
        value={formData.no_of_orders}
      />

      <p className="mb-1 mt-4">Amount</p>
      <NumberInput
        onChange={(e) => updateFormData(e.target.value, "amount")}
        placeholder="Amount per order"
        value={formData.amount}
      />

      <hr className="mt-4" />

      <p className="mb-1 mt-2">Account number</p>
      <NumberInput
        onChange={(e) =>
          setFormData((k) => {
            return {
              ...k,
              bank_account_details: {
                ...k.bank_account_details,
                account_number: e.target.value.replace(" ", ""),
              },
            };
          })
        }
        placeholder="Account number"
        value={formData.bank_account_details.account_number}
      />

      <p className="mb-1 mt-4">Bank name</p>
      <SelectInput
        onChange={(e) => setBankCode(e.target.value)}
        value={bankCode}
        options={[
          { value: "", text: "Select bank" },
          ...BANKS.map((b) => {
            return { value: b.code, text: b.name };
          }),
        ]}
      />

      {formData.bank_account_details.account_name ? (
        <>
          <p className="mb-1 mt-4">Account name</p>
          <div className="w-full border-2 border-blue outline-none py-2 px-3 rounded-lg bg-white">
            {formData.bank_account_details.account_name}
          </div>
        </>
      ) : (
        <button
          disabled={isDisabled}
          onClick={getAccountName}
          className="w-full mt-4 bg-blue py-2.5 text-white rounded-md disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
        >
          Get account name{" "}
          {isLoading && <AiOutlineLoading3Quarters className="animate-spin" />}
        </button>
      )}

      <button
        disabled={disabled}
        onClick={registerDeliverer}
        className="w-full mt-4 bg-blue py-2.5 text-white rounded-md disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
      >
        Register
        {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
      </button>
    </div>
  );
};

export default DeliverersDetails;
