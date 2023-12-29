import { create_flashcard } from "@/atoms/atoms";
import { SelectInput, Textarea, TextInput } from "@/components/general/Input";
import { auth, db } from "@/services/firebase";
import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSetRecoilState } from "recoil";

const CreateFlashcard = ({ course_codes }: { course_codes: string[] }) => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const setCreateFlashcard = useSetRecoilState(create_flashcard);
  const [courseInput, setCourseInput] = useState<"add" | "select">("add");
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    course_code: "",
  });

  const updateFormData = (text: string, which: string) => {
    setFormData((k) => {
      return { ...k, [which]: text };
    });
  };

  const addFlashcard = async () => {
    const { answer, course_code, question } = formData;

    if (!course_code) {
      toast.error("Please input the course code.");
      return;
    }

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
          [course_code.split(" ").join("_")]: arrayUnion({
            question,
            answer,
            id: Date.now(),
          }),
        },
        { merge: true }
      );

      toast.success("Flashcard saved.");
      setCreateFlashcard(null);
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
      <div className="w-full flex gap-2">
        {courseInput === "select" ? (
          <SelectInput
            onChange={(e) => updateFormData(e.target.value, "course_code")}
            value={formData.course_code}
            options={[
              { text: "", value: "" },
              ...course_codes.map((c) => {
                return { text: c, value: c };
              }),
            ]}
          />
        ) : (
          <TextInput
            onChange={(e) =>
              updateFormData(e.target.value.toUpperCase(), "course_code")
            }
            value={formData.course_code}
            placeholder="Course code"
          />
        )}
        <button
          className="w-full bg-blue text-white rounded-md"
          onClick={() => {
            setCourseInput((k) => (k === "add" ? "select" : "add"));
            updateFormData("", "course");
          }}
        >
          {courseInput === "select" ? "Add" : "Select"} course
        </button>
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
        onClick={addFlashcard}
        disabled={disabled}
      >
        Save
        {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
      </button>
    </>
  );
};

export default CreateFlashcard;
