import { Textarea } from "@/components/general/Input";
import { auth, db } from "@/services/firebase";
import { UpdateFlashcardProps } from "@/types/dashboard";
import { arrayRemove, arrayUnion, doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const EditFlashcard = ({
  details,
  course_code,
  close,
}: UpdateFlashcardProps) => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [formData, setFormData] = useState({
    question: details.question,
    answer: details.answer,
    course_code: course_code,
  });

  const updateFormData = (text: string, which: string) => {
    setFormData((k) => {
      return { ...k, [which]: text };
    });
  };

  const editFlashcard = async () => {
    const { answer, question } = formData;

    if (!question) {
      toast.error("Please input the question.");
      return;
    }

    if (!answer) {
      toast.error("Please input the answer.");
      return;
    }

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

      await setDoc(
        doc(db, "flashcards", auth.currentUser!.uid),
        {
          [course_code.split(" ").join("_")]: arrayUnion({
            question,
            answer,
            id: details.id,
          }),
        },
        { merge: true }
      );

      toast.success("Flashcard saved.");
      close(null);
    } catch (e: any) {
      toast.error(`Error: ${e.code.split("/")[1]}.`);
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  };

  return (
    <>
      <p className="mb-1 text-lg">Course code</p>
      <div className="w-full border-2 border-blue outline-none py-2 px-3 rounded-lg bg-white">
        {formData.course_code}
      </div>

      <p className="mb-1 text-lg mt-3">Question</p>
      <Textarea
        onChange={(e) => updateFormData(e.target.value, "question")}
        value={formData.question}
        placeholder="Question"
      />

      <p className="mb-1 text-lg mt-2">Answer</p>
      <Textarea
        onChange={(e) => updateFormData(e.target.value, "answer")}
        value={formData.answer}
        placeholder="Answer"
      />

      <button
        className="bg-blue text-white py-2 w-full mt-2 px-3 rounded-md disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
        onClick={editFlashcard}
        disabled={disabled}
      >
        Save
        {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
      </button>
    </>
  );
};

export default EditFlashcard;
