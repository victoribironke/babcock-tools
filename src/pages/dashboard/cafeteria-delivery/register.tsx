import HeadTemplate from "@/components/general/HeadTemplate";
import { NumberInput, SelectInput } from "@/components/general/Input";
import { checkAuthentication } from "@/components/hoc/ProtectedRoute";
import { BANKS } from "@/constants/banks";
import { DAYS } from "@/constants/dashboard";
import { auth, db } from "@/services/firebase";
import { classNames } from "@/utils/helpers";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const RegisterAsADeliverer = () => {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bankCode, setBankCode] = useState("");
  const router = useRouter();
  const [formData, setFormData] = useState({
    amount: "",
    no_of_orders: "",
    bank_account_details: {
      account_number: "",
      bank_name: "",
      account_name: "",
    },
    schedule: {
      breakfast: [],
      lunch: [],
      dinner: [],
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
      schedule,
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

      const req = await fetch("https://api.paystack.co/subaccount", {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_LIVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          business_name: account_name,
          bank_code: bankCode,
          account_number,
          percentage_charge: 0,
        }),
      });
      const data = await req.json();

      if (!data.status) {
        toast.error("An error occured.");
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
        schedule,
        subaccount_code: data.data.subaccount_code,
      });

      await updateDoc(doc(db, "users", auth.currentUser?.uid!), {
        is_deliverer: true,
      });

      await fetch(
        `/api/send-welcome-message?email=${user_info.email}&first_name=${
          user_info.full_name.split(" ")[0]
        }`
      ).catch(() => {});

      toast.success("Your profile was created.");
      localStorage.setItem(
        "bt_user_info",
        JSON.stringify({
          ...user_info,
          is_deliverer: true,
        })
      );
      router.reload();
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
    <>
      <HeadTemplate title="Register as a deliverer" />

      <section className="w-full py-6 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <p className="text-2xl font-medium mb-2 text-blue">
            Register as a cafeteria deliverer
          </p>

          <p className="text-gray-500 mb-5">
            Your details from the current signed-in account together with the
            information below will be used to create a deliverer profile for you
            which you can edit later.
          </p>

          <p className="mb-1">Max number of orders</p>
          <p className="mb-2 text-sm text-gray-500">
            If you won&apos;t be able to deliver, set this number to 0, and you
            can set it back when you&apos;re ready again.
          </p>
          <NumberInput
            onChange={(e) => updateFormData(e.target.value, "no_of_orders")}
            placeholder="Max number of orders you can take per meal time"
            value={formData.no_of_orders}
          />

          <p className="mb-1 mt-4">
            Amount{" "}
            <span className="text-sm text-gray-500">min. 200, max. 500</span>
          </p>
          <NumberInput
            onChange={(e) => updateFormData(e.target.value, "amount")}
            placeholder="Amount per order"
            value={formData.amount}
            onBlur={() => {
              if (formData.amount === "") return;

              if (parseInt(formData.amount) < 200)
                updateFormData("200", "amount");
              if (parseInt(formData.amount) > 500)
                updateFormData("500", "amount");
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
                            ? k.schedule.breakfast.filter(
                                (a) => a !== (d as never)
                              )
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
                            ? k.schedule.dinner.filter(
                                (a) => a !== (d as never)
                              )
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
            </>
          ) : (
            <button
              disabled={isDisabled}
              onClick={getAccountName}
              className="w-full mt-4 bg-blue py-2.5 text-white rounded-md disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
            >
              Get account name{" "}
              {isLoading && (
                <AiOutlineLoading3Quarters className="animate-spin" />
              )}
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
      </section>
    </>
  );
};

export default checkAuthentication(RegisterAsADeliverer);
