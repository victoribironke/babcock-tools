import { new_event } from "@/atoms/atoms";
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
  isValidEmail,
  isValidURL,
} from "@/utils/helpers";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSetRecoilState } from "recoil";

const NewEvent = () => {
  // set a subaccount when a paid event is created
  const initialState = {
    name: "",
    location: "",
    link: "",
    type: "Physical", // physical or virtual
    image: "",
    description: "",
    date_time: "",
    is_free: true,
    no_of_tickets: "",
    price_per_ticket: "",
    bank_account_details: {
      account_number: "",
      bank_name: "",
      account_name: "",
    },
    public: false,
    support_email: "",
  };
  const eventDetails: Event = JSON.parse(
    localStorage.getItem("bt-new-event") ?? JSON.stringify(initialState)
  );
  const [formData, setFormData] = useState(eventDetails);
  const [bankCode, setBankCode] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setNewEvent = useSetRecoilState(new_event);

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

  const createEvent = async () => {
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
      support_email,
    } = formData;

    if (!name || !date_time || !description || !support_email) {
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

    if (!isValidEmail(support_email)) {
      toast.error("Please input a valid email address.");
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
        const { account_name, account_number } = bank_account_details;

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

      const docRef = await addDoc(collection(db, "events"), {
        ...formData,

        no_of_tickets: formData.no_of_tickets
          ? formData.no_of_tickets
          : "Unlimited",
        attendees: 0,
        subaccount_code: code,
        creator: auth.currentUser?.uid,
      });

      await updateDoc(doc(db, "events", docRef.id), {
        id: docRef.id,
      });

      toast.success("Event created.");
      localStorage.removeItem("bt-new-event");
      setNewEvent(false);
    } catch (e) {
      toast.error("An error occured.");
    } finally {
      setLoading(false);
      setDisabled(false);
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

  useEffect(() => {
    localStorage.setItem("bt-new-event", JSON.stringify(formData));
  }, [formData]);

  return (
    <>
      <p className="text-gray-400 italic">
        Your progress is saved on this browser, on this device.
      </p>

      <label className="inline-flex mt-4 items-center cursor-pointer self-start">
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

      {formData.image ? (
        <div className="w-full sm:w-1/2 mt-2">
          <img
            src={formData.image}
            alt="Event image"
            className="w-full object-cover rounded-lg"
          />
          <button
            className="mt-2 rounded-lg bg-blue text-white py-1 px-2 text-sm"
            onClick={() => {
              updateFormData("", "image");
            }}
          >
            Replace banner
          </button>
        </div>
      ) : (
        <>
          <p className="mt-2 mb-1">Event banner</p>
          <input
            type="file"
            accept=".png,.jpg,.webp,.jpeg"
            className="w-full text-black text-sm bg-white border-2 border-blue file:cursor-pointer cursor-pointer file:border-0 file:py-2.5 file:px-4 file:bg-blue file:text-white file:mr-2 rounded-lg"
            onChange={(e) => {
              const file = e.target.files![0];
              const reader = new FileReader();
              reader.onloadend = () => {
                updateFormData(reader.result as string, "image");
              };

              reader.readAsDataURL(file);
            }}
          />
        </>
      )}

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

      <p className="mb-1 mt-4">Support email *</p>
      <TextInput
        onChange={(e) => updateFormData(e.target.value, "support_email")}
        value={formData.support_email}
        placeholder="Support email"
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
        onClick={createEvent}
      >
        Create event
        {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
      </button>
    </>
  );
};

export default NewEvent;
