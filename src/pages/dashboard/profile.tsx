import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { auth, db } from "@/services/firebase";
import { useRouter } from "next/router";
import { PAGES } from "@/constants/pages";
import { doc, updateDoc } from "firebase/firestore";
import { HALLS_OF_RESIDENCE } from "@/constants/babcock";
import { checkAuthentication } from "@/components/hoc/ProtectedRoute";
import {
  NumberInput,
  SelectInput,
  TextInput,
} from "@/components/general/Input";
import HeadTemplate from "@/components/general/HeadTemplate";

const AccountProfile = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    hall_of_residence: "Winslow",
    id: "", // Matric No / App ID
  });

  const updateFormData = (text: string, which: string) => {
    setFormData((k) => {
      return { ...k, [which]: text };
    });
  };

  const signUpUser = async () => {
    const { id, email, full_name, hall_of_residence, phone } = formData;

    if (!full_name) {
      toast.error("Please input your full name.");
      return;
    }

    if (!id) {
      toast.error("Please input your matric no or app id.");
      return;
    }

    if (!phone) {
      toast.error("Please input your phone number.");
      return;
    }

    try {
      setLoading(true);
      setDisabled(true);

      const user_info = JSON.parse(localStorage.getItem("bt_user_info")!);

      if (user_info.is_deliverer) {
        await updateDoc(doc(db, "deliverers", auth.currentUser?.uid!), {
          full_name,
          phone_number: phone,
          hall_of_residence,
          matric_no: id,
        });
      }

      await updateDoc(doc(db, "users", auth.currentUser?.uid!), {
        full_name,
        phone_number: phone,
        hall_of_residence,
        matric_no: id,
      });

      toast.success("Account updated.");
      localStorage.setItem(
        "bt_user_info",
        JSON.stringify({
          email,
          full_name,
          hall_of_residence,
          matric_no: id,
          phone_number: phone,
          is_deliverer: user_info.is_deliverer ? true : false,
        })
      );
      router.push(PAGES.dashboard);
    } catch (e: any) {
      toast.error(`Error: ${e.code.split("/")[1]}.`);
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  };

  useEffect(() => {
    const user_info = JSON.parse(localStorage.getItem("bt_user_info")!);

    setFormData({
      email: user_info.email,
      full_name: user_info.full_name,
      hall_of_residence: user_info.hall_of_residence,
      id: user_info.matric_no,
      phone: user_info.phone_number,
    });
  }, []);

  return (
    <>
      <HeadTemplate title="Account profile" />

      <section className="w-full py-6 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <p className="text-2xl font-medium mb-5 text-blue">
            Edit your account details
          </p>

          <p className="text-lg mb-1">Full name</p>
          <TextInput
            onChange={(e) => updateFormData(e.target.value, "full_name")}
            placeholder="Full name"
            value={formData.full_name}
          />

          <p className="text-lg mb-1 mt-4">Matric no / App ID</p>
          <TextInput
            onChange={(e) => updateFormData(e.target.value, "id")}
            placeholder="Matric No / App ID"
            value={formData.id}
          />

          <p className="text-lg mb-1 mt-4">Hall of residence</p>
          <SelectInput
            onChange={(e) =>
              updateFormData(e.target.value, "hall_of_residence")
            }
            value={formData.hall_of_residence}
            options={HALLS_OF_RESIDENCE.map((h) => {
              return { value: h, text: h };
            })}
          />

          {/* <p className="text-lg mb-1 mt-4">Email</p>
          <EmailInput
            onChange={(e) => updateFormData(e.target.value, "email")}
            placeholder="Email"
            value={formData.email}
          /> */}

          <p className="text-lg mb-1 mt-4">Phone number</p>
          <NumberInput
            onChange={(e) => updateFormData(e.target.value, "phone")}
            placeholder="Phone number"
            value={formData.phone}
            maxLength={11}
          />

          <button
            disabled={disabled}
            onClick={signUpUser}
            className="w-full mt-4 bg-blue py-2.5 text-white rounded-md disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
          >
            Save
            {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
          </button>
        </div>
      </section>
    </>
  );
};

export default checkAuthentication(AccountProfile);
