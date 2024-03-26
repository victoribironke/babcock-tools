import { edit_event, new_event } from "@/atoms/atoms";
import {
  NumberInput,
  SelectInput,
  TextInput,
  Textarea,
} from "@/components/general/Input";
import { BANKS } from "@/constants/banks";
import { auth, db } from "@/services/firebase";
import { Event } from "@/types/dashboard";
import {
  createSubaccount,
  getAccountName,
  isValidURL,
  updateSubaccount,
} from "@/utils/helpers";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRecoilState, useSetRecoilState } from "recoil";

const EditEvent = () => {
  const [editEvent, setEditEvent] = useRecoilState(edit_event);
  const [formData, setFormData] = useState(editEvent as Event);
  const [bankCode, setBankCode] = useState(
    BANKS.find((b) => b.name === formData.bank_account_details.bank_name)
      ?.code ?? ""
  );
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [firstUpdate, setFirstUpdate] = useState(true);

  const updateFormData = (text: string, which: string) => {
    setFormData((k) => {
      return { ...k, [which]: text };
    });
  };

  const getAccountNameFromAPI = async () => {
    setIsLoading(true);
    setIsDisabled(true);

    const { data, error } = await getAccountName(
      formData.bank_account_details.account_number,
      bankCode
    );

    setIsLoading(false);
    setIsDisabled(false);

    if (error) {
      toast.error(error);
      return;
    }

    setFormData((k) => {
      return {
        ...k,
        bank_account_details: {
          ...k.bank_account_details,
          account_name: data,
          bank_name: BANKS.find((b) => b.code === bankCode)!.name,
        },
      };
    });
  };

  const saveEvent = async () => {
    const {
      name,
      date_time,
      description,
      link,
      location,
      is_free,
      type,
      bank_account_details,
      price_per_ticket,
    } = formData;

    if (!name || !date_time || !description) {
      toast.error("Please fill in the required fields.");
      return;
    }

    if (type === "Physical" && !location) {
      toast.error("Please fill in the required fields.");
      return;
    }

    if (type === "Virtual" && (!link || !isValidURL(link))) {
      toast.error("Please input a valid link.");
      return;
    }

    if (!is_free) {
      if (!price_per_ticket) {
        toast.error("Please input in the price per ticket.");
        return;
      }

      if (!bank_account_details.account_name) {
        toast.error("Please fill in your bank details.");
        return;
      }
    }

    try {
      setLoading(true);
      setDisabled(true);

      let code = "";

      if (!is_free) {
        const { account_name, account_number, bank_name } =
          bank_account_details;
        const {
          bank_account_details: { account_number: an, bank_name: bn },
          subaccount_code,
        } = editEvent!;

        if (account_number === an && bank_name === bn)
          console.log("No updates.");
        else {
          if (subaccount_code) {
            const { error } = await updateSubaccount(subaccount_code, {
              account_name,
              account_number,
              bank_code: bankCode,
            });

            if (error) {
              toast.error(error);
              return;
            }

            code = subaccount_code;
          } else {
            const { data, error } = await createSubaccount(
              account_name,
              bankCode,
              account_number
            );

            if (error) {
              toast.error(error);
              return;
            }

            code = data;
          }
        }
      } // checks if the bank details are the same as before and if it isn't, checks if there was already a subaccount, in which case, it would be edited, else, a new one would be created

      await updateDoc(doc(db, "events", editEvent!.id), {
        ...formData,

        no_of_tickets: formData.no_of_tickets
          ? formData.no_of_tickets
          : "Unlimited",
        subaccount_code: code ? code : editEvent?.subaccount_code,
      });

      toast.success("Event edited.");
      setEditEvent(null);
    } catch (e) {
      toast.error("An error occured.");
    } finally {
      setLoading(false);
      setDisabled(false);
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
    <>
      <label className="inline-flex items-center cursor-pointer self-start">
        <input
          type="checkbox"
          onClick={() =>
            setFormData((k) => {
              return { ...k, public: !k.public };
            })
          }
          className="sr-only peer"
          checked={formData.public}
        />
        <div className="relative w-11 h-[1.48rem] peer-focus:outline-none bg-gray-200 peer-checked:bg-blue rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2.5px] after:start-[3px] peer-checked:after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[1.15rem] after:w-[1.15rem] after:transition-all"></div>
        <span className="ms-3">Set as public</span>
      </label>

      <p className="mb-1 mt-4">Event name *</p>
      <TextInput
        onChange={(e) => updateFormData(e.target.value, "name")}
        value={formData.name}
        placeholder="Event name"
      />

      <p className="mb-1 mt-4">Event description *</p>
      <Textarea
        onChange={(e) => updateFormData(e.target.value, "description")}
        value={formData.description}
        placeholder="Event description"
      />

      <label className="inline-flex mt-4 items-center cursor-pointer self-start">
        <input
          type="checkbox"
          onClick={() =>
            updateFormData(
              formData.type === "Physical" ? "Virtual" : "Physical",
              "type"
            )
          }
          className="sr-only peer"
          checked={formData.type === "Virtual"}
        />
        <span className="me-3">Physical</span>
        <div className="relative w-11 h-[1.48rem] peer-focus:outline-none bg-blue rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2.5px] after:start-[3px] peer-checked:after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[1.15rem] after:w-[1.15rem] after:transition-all"></div>
        <span className="ms-3">Virtual</span>
      </label>

      {formData.type === "Physical" ? (
        <>
          <p className="mb-1 mt-4">Event location *</p>
          <TextInput
            onChange={(e) => updateFormData(e.target.value, "location")}
            value={formData.location}
            placeholder="Event location"
          />
        </>
      ) : (
        <>
          <p className="mb-1 mt-4">Event link *</p>
          <TextInput
            onChange={(e) => updateFormData(e.target.value, "link")}
            value={formData.link}
            placeholder="Event link"
          />
        </>
      )}

      <p className="mb-1 mt-4">Event date and time *</p>
      <input
        type="datetime-local"
        onChange={(e) => updateFormData(e.target.value, "date_time")}
        value={formData.date_time}
        className="w-full border-2 border-blue outline-none py-2 px-3 rounded-lg bg-white"
      />

      <p className="mt-4">Number of available tickets</p>
      <p className="mb-1 text-sm text-gray-400 italic">
        Leave blank for an event with unlimited tickets
      </p>
      <NumberInput
        onChange={(e) => updateFormData(e.target.value, "no_of_tickets")}
        placeholder="Number of tickets"
        value={formData.no_of_tickets}
      />

      <label className="inline-flex mt-4 items-center cursor-pointer self-start">
        <input
          type="checkbox"
          onClick={() =>
            setFormData((k) => {
              return { ...k, is_free: !k.is_free };
            })
          }
          className="sr-only peer"
          checked={!formData.is_free}
        />
        <span className="me-3">Free</span>
        <div className="relative w-11 h-[1.48rem] peer-focus:outline-none bg-blue rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2.5px] after:start-[3px] peer-checked:after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[1.15rem] after:w-[1.15rem] after:transition-all"></div>
        <span className="ms-3">Paid</span>
      </label>

      {!formData.is_free && (
        <>
          <p className="mt-4">Price per ticket</p>
          <p className="mb-1 text-sm text-gray-400 italic">
            A 4% fee is passed on to the buyer (min. ₦100, max. ₦1000)
          </p>
          <NumberInput
            onChange={(e) => updateFormData(e.target.value, "price_per_ticket")}
            placeholder="Price per ticket"
            value={formData.price_per_ticket}
          />

          <div className="w-full flex flex-col sm:flex-row gap-4 mt-4">
            <div className="w-full sm:w-1/2">
              <p className="mb-1">Account number *</p>
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
            </div>

            <div className="w-full sm:w-1/2">
              <p className="mb-1">Bank name *</p>
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
            </div>
          </div>

          {formData.bank_account_details.account_name ? (
            <p className="mb-1 mt-4">
              Account name:{" "}
              <span className="font-medium">
                {formData.bank_account_details.account_name}
              </span>
            </p>
          ) : (
            <button
              disabled={isDisabled}
              onClick={getAccountNameFromAPI}
              className="w-full mt-4 bg-blue py-2.5 text-white rounded-md disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
            >
              Get account name{" "}
              {isLoading && (
                <AiOutlineLoading3Quarters className="animate-spin" />
              )}
            </button>
          )}
        </>
      )}

      <button
        className="w-full mt-4 bg-blue py-2.5 text-white rounded-md disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
        disabled={disabled}
        onClick={saveEvent}
      >
        Save event
        {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
      </button>
    </>
  );
};

export default EditEvent;
