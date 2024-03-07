// import { deactivate_deliverer_profile } from "@/atoms/atoms";
import { NumberInput, SelectInput } from "@/components/general/Input";
import { BANKS } from "@/constants/banks";
import { DAYS } from "@/constants/dashboard";
import { auth, db } from "@/services/firebase";
import { DelivererDetailsProps } from "@/types/dashboard";
import { classNames } from "@/utils/helpers";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
// import { useSetRecoilState } from "recoil";

const DeliverersDetails = ({ deliverer }: DelivererDetailsProps) => {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [firstUpdate, setFirstUpdate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // const setDeactivateDelivererProfile = useSetRecoilState(
  //   deactivate_deliverer_profile
  // );
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
    schedule: deliverer!.schedule,
    subaccount_code: deliverer!.subaccount_code,
  });

  const updateFormData = (text: string, which: string) => {
    setFormData((k) => {
      return { ...k, [which]: text };
    });
  };

  const saveDeliverer = async () => {
    const {
      amount,
      no_of_orders,
      schedule,
      bank_account_details: { account_number, bank_name, account_name },
    } = formData;

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

      const req = await fetch(
        `https://api.paystack.co/subaccount/${formData.subaccount_code}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_LIVE_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify({
            business_name: account_name,
            bank_code: bankCode,
            account_number,
          }),
        }
      );
      const data = await req.json();

      if (!data.status) {
        toast.error("An error occured.");
        return;
      }

      await updateDoc(doc(db, "deliverers", auth.currentUser?.uid!), {
        amount_per_order: amount,
        max_number_of_orders: no_of_orders,
        bank_account_details: {
          account_number,
          bank_name,
          account_name,
        },
        schedule,
      });

      toast.success("Your profile was saved.");
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
    if (firstUpdate) {
      setFirstUpdate(false);
    } else {
      setFormData((k) => {
        return {
          ...k,
          bank_account_details: {
            ...k.bank_account_details,
            account_name: "",
          },
        };
      });
    }
  }, [formData.bank_account_details.account_number, bankCode]);

  return (
    <div className="max-w-md w-full my-4">
      <p className="text-2xl font-medium mb-2 text-blue">Edit your profile</p>

      <p className="mb-1">Max number of orders</p>
      <p className="mb-2 text-sm text-gray-500">
        If you won&apos;t be able to deliver, set this number to 0, and you can
        set it back when you&apos;re ready again.
      </p>
      <NumberInput
        onChange={(e) => updateFormData(e.target.value, "no_of_orders")}
        placeholder="Max number of orders you can take per meal time"
        value={formData.no_of_orders}
      />

      <p className="mb-1 mt-4">
        Amount <span className="text-sm text-gray-500">min. 200, max. 500</span>
      </p>
      <NumberInput
        onChange={(e) => updateFormData(e.target.value, "amount")}
        placeholder="Amount per order"
        value={formData.amount}
        onBlur={() => {
          if (formData.amount === "") return;

          if (parseInt(formData.amount) < 200) updateFormData("200", "amount");
          if (parseInt(formData.amount) > 500) updateFormData("500", "amount");
        }}
      />

      <p className="mb-2 mt-4">Schedule</p>
      <div className="flex items-center justify-center rs:justify-between flex-wrap gap-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="font-medium">Breakfast</p>
          {DAYS.map((d, i) => (
            <button
              key={i}
              className={classNames(
                "w-full py-1 px-3 rounded",
                formData.schedule.breakfast.includes(d as never)
                  ? "bg-blue text-white"
                  : "bg-gray-200"
              )}
              onClick={() =>
                setFormData((k) => {
                  return {
                    ...k,
                    schedule: {
                      ...k.schedule,
                      breakfast: k.schedule.breakfast.includes(d as never)
                        ? k.schedule.breakfast.filter((a) => a !== (d as never))
                        : [...k.schedule.breakfast, d as never],
                    },
                  };
                })
              }
            >
              {d}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <p className="font-medium">Lunch</p>
          {DAYS.map((d, i) => (
            <button
              key={i}
              className={classNames(
                "w-full py-1 px-3 rounded",
                formData.schedule.lunch.includes(d as never)
                  ? "bg-blue text-white"
                  : "bg-gray-200"
              )}
              onClick={() =>
                setFormData((k) => {
                  return {
                    ...k,
                    schedule: {
                      ...k.schedule,
                      lunch: k.schedule.lunch.includes(d as never)
                        ? k.schedule.lunch.filter((a) => a !== (d as never))
                        : [...k.schedule.lunch, d as never],
                    },
                  };
                })
              }
            >
              {d}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <p className="font-medium">Dinner</p>
          {DAYS.map((d, i) => (
            <button
              key={i}
              className={classNames(
                "w-full py-1 px-3 rounded",
                formData.schedule.dinner.includes(d as never)
                  ? "bg-blue text-white"
                  : "bg-gray-200"
              )}
              onClick={() =>
                setFormData((k) => {
                  return {
                    ...k,
                    schedule: {
                      ...k.schedule,
                      dinner: k.schedule.dinner.includes(d as never)
                        ? k.schedule.dinner.filter((a) => a !== (d as never))
                        : [...k.schedule.dinner, d as never],
                    },
                  };
                })
              }
            >
              {d}
            </button>
          ))}
        </div>
      </div>

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
          <p className="mb-1 mt-4">
            Account name:{" "}
            <span className="font-medium">
              {formData.bank_account_details.account_name}
            </span>
          </p>
          {/* <div className="w-full border-2 border-blue outline-none py-2 px-3 rounded-lg bg-white">
            {formData.bank_account_details.account_name}
          </div> */}
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

      <div className="mt-4 flex items-center justify-center gap-4 flex-col-reverse sm:flex-row">
        {/* <button
          onClick={() =>
            setDeactivateDelivererProfile(formData.subaccount_code)
          }
          className="w-full bg-red py-2.5 text-white rounded-md"
        >
          Deactivate deliverer profile
        </button> */}

        <button
          disabled={disabled}
          onClick={saveDeliverer}
          className="w-full bg-blue py-2.5 text-white rounded-md disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
        >
          Save
          {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
        </button>
      </div>
    </div>
  );
};

export default DeliverersDetails;
