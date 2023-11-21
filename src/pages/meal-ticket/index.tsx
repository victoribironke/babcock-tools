import { getEmailModal } from "@/atoms/atoms";
import HeadTemplate from "@/components/general/HeadTemplate";
import Modal from "@/components/general/Modal";
import Header from "@/components/meal-ticket/Header";
import Tickets from "@/components/meal-ticket/Tickets";
import { useRecoilState } from "recoil";
// import { usePaystackPayment } from "react-paystack";
import { EmailInput } from "@/components/general/Input";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { isValidEmail } from "@/utils/helpers";

const MealTicketPage = () => {
  const [emailModal, setEmailModal] = useRecoilState(getEmailModal);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  // const config = {
  //   email,
  //   reference: new Date().getTime().toString(),
  //   amount: 10000,
  //   publicKey:
  //     process.env.NODE_ENV === "development"
  //       ? process.env.NEXT_PUBLIC_PAYSTACK_TEST_PUBLIC_KEY!
  //       : process.env.NEXT_PUBLIC_PAYSTACK_LIVE_PUBLIC_KEY!,
  // };

  // const initializePayment = usePaystackPayment(config);

  // const showPaymentDialog = () => {
  //   if (!email || !isValidEmail(email)) {
  //     toast.error("Please input a valid email.");
  //     return;
  //   }

  //   setLoading(true);
  //   setDisabled(true);

  //   const onSuccess = () => {
  //     toast.success("Payment successful. Please check your email.");

  //     fetch(
  //       `/api/send-meal-ticket-info?email=${email}&ticket_id=${emailModal.ticket_id}`
  //     ).catch(() => {
  //       toast.error("A server error occured.");
  //     });

  //     setEmailModal({ ticket_id: "" });
  //     setEmail("");
  //     setLoading(false);
  //     setDisabled(false);
  //   };

  //   const onClose = () => {
  //     toast.error("Payment cancelled.");

  //     setLoading(false);
  //     setDisabled(false);
  //   };

  //   initializePayment(onSuccess, onClose);
  // };

  const sendOwnersDetails = () => {
    if (!email || !isValidEmail(email)) {
      toast.error("Please input a valid email.");
      return;
    }

    setLoading(true);
    setDisabled(true);

    fetch(
      `/api/send-meal-ticket-info?email=${email}&ticket_id=${emailModal.ticket_id}`
    )
      .then(() => {
        toast.success("Please check your email.");
      })
      .catch(() => {
        toast.error("A server error occured.");
      })
      .finally(() => {
        setEmailModal({ ticket_id: "" });
        setEmail("");

        setLoading(false);
        setDisabled(false);
      });
  };

  return (
    <>
      <HeadTemplate title="Buy a meal ticket" />

      <section className="w-full max-w-4xl px-4 sm:px-8 py-12">
        <Header />
        <Tickets />
      </section>

      {emailModal.ticket_id && (
        <Modal
          header="Buy a ticket"
          dismiss={() => setEmailModal({ ticket_id: "" })}
        >
          <p className="sm:text-lg mb-1">
            Enter your email address to continue
          </p>
          <EmailInput
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            value={email}
          />
          <button
            disabled={disabled}
            onClick={sendOwnersDetails}
            className="w-full mt-4 bg-blue py-2.5 text-white rounded-md disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
          >
            Get owner's details
            {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
          </button>
        </Modal>
      )}
    </>
  );
};

export default MealTicketPage;
