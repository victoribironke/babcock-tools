import { get_ticket_details } from "@/atoms/atoms";
import HeadTemplate from "@/components/general/HeadTemplate";
import Modal from "@/components/general/Modal";
import Header from "@/components/meal-ticket/Header";
import Tickets from "@/components/meal-ticket/Tickets";
import { useRecoilState } from "recoil";
import { EmailInput } from "@/components/general/Input";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { isValidEmail } from "@/utils/helpers";

const MealTicketPage = () => {
  const [getTicketDetails, setGetTicketDetails] =
    useRecoilState(get_ticket_details);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const sendOwnersDetails = async () => {
    if (!email || !isValidEmail(email)) {
      toast.error("Please input a valid email.");
      return;
    }

    setLoading(true);
    setDisabled(true);

    try {
      await fetch(
        `/api/send-meal-ticket-info?email=${email}&ticket_id=${getTicketDetails.ticket_id}`
      );
      toast.success("Please check your email.");
    } catch (e: any) {
      toast.error("A server error occured.");
    } finally {
      setGetTicketDetails({ ticket_id: "" });
      setEmail("");

      setLoading(false);
      setDisabled(false);
    }
  };

  return (
    <>
      <HeadTemplate title="Buy a meal ticket" />

      <section className="w-full max-w-6xl px-4 sm:px-8 py-8">
        <Header />
        <Tickets />
      </section>

      {getTicketDetails.ticket_id && (
        <Modal
          header="Buy a ticket"
          dismiss={() => setGetTicketDetails({ ticket_id: "" })}
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
            Get owner&apos;s details
            {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
          </button>
        </Modal>
      )}
    </>
  );
};

export default MealTicketPage;
