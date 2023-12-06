import { Dispatch, SetStateAction, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import toast from "react-hot-toast";
import { arrayRemove, doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/services/firebase";
import { FullFlashcard } from "@/types/dashboard";

const DeleteFlashcard = ({
  details,
  close,
  course_code,
}: {
  details: FullFlashcard;
  course_code: string;
  close: Dispatch<SetStateAction<FullFlashcard | null>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const deleteCard = async () => {
    try {
      setLoading(true);
      setDisabled(true);

      await setDoc(
        doc(db, "flashcards", auth.currentUser!.uid),
        {
          [course_code.split(" ").join("_")]: arrayRemove({
            question: details.question,
            answer: details.answer,
            id: details.id,
          }),
        },
        { merge: true }
      );

      toast.success("Flashcard deleted.");
      close(null);
    } catch (e: any) {
      toast.error(`Error: ${e.code.split("/")[1]}`);
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  };

  return (
    <>
      <p>
        Are you sure you want to delete this card? This action cannot be undone.
      </p>

      <div className="flex gap-4 mt-4">
        <button
          className="border w-full text-blue py-2 rounded-md font-medium"
          onClick={() => close(null)}
        >
          Cancel
        </button>

        <button
          className="bg-red flex items-center justify-center gap-3 w-full text-white py-2 rounded-md font-medium disabled:cursor-not-allowed disabled:opacity-70"
          onClick={deleteCard}
          disabled={disabled}
        >
          Delete
          {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
        </button>
      </div>
    </>
  );
};

export default DeleteFlashcard;
