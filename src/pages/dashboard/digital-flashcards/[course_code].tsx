import {
  create_new_flashcard,
  delete_flashcard,
  edit_flashcard,
  flashcards_for_practice,
  start_practice,
} from "@/atoms/atoms";
import HeadTemplate from "@/components/general/HeadTemplate";
import PageLoader from "@/components/general/PageLoader";
import { checkAuthentication } from "@/components/hoc/ProtectedRoute";
import NotFound from "@/pages/404";
import { auth, db } from "@/services/firebase";
import { FullFlashcard } from "@/types/dashboard";
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

const CourseCards = () => {
  const router = useRouter();
  const { course_code } = router.query;
  const [cards, setCards] = useRecoilState(flashcards_for_practice);
  const setEditFlashcard = useSetRecoilState(edit_flashcard);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const setCreateFlashcard = useSetRecoilState(create_new_flashcard);
  const setStartPractice = useSetRecoilState(start_practice);
  const setDeleteFlashcard = useSetRecoilState<FullFlashcard | null>(
    delete_flashcard
  );
  const new_course_code = (course_code as string)
    ?.split("-")
    .join(" ")
    .toUpperCase();

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "flashcards", auth.currentUser!.uid),
      (doc) => {
        const flashcards = doc.data()!;

        const code = (course_code as string)
          ?.split("-")
          .join("_")
          .toUpperCase();

        if (!flashcards[code]) {
          setIsError(true);
          return;
        }

        setCards(flashcards[code]);
        setIsLoading(false);
      }
    );

    return unsub;
  }, [router]);

  if (isError) return <NotFound />;

  return (
    <>
      <HeadTemplate title={`Digital flashcards — ${new_course_code}`} />

      <>
        <div className="flex gap-2 items-center w-full flex-wrap max-w-5xl">
          <p className="font-medium md:text-lg mr-auto">Your flashcards</p>

          <button
            className="bg-green text-white py-1 px-3 rounded-md text-sm md:text-base"
            onClick={() => setCreateFlashcard(true)}
          >
            Create flashcard
          </button>
          <button
            className="bg-blue text-white py-1 px-3 rounded-md text-sm md:text-base"
            onClick={() => setStartPractice(new_course_code)}
          >
            Start practice
          </button>
        </div>

        {!isLoading ? (
          <div className="w-full mt-5 gap-3 grid grid-cols-1 rs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-5xl">
            {cards.map((c, i) => (
              <div className="bg-white rounded-lg shadow-md p-2 border" key={i}>
                <p className="w-full h-28 bg-green text-white text-center rounded flex items-center justify-center mb-2 p-4">
                  {c.question.slice(0, 50)}
                  {c.question.length > 50 && "..."}
                </p>

                <div className="w-full flex gap-2">
                  <button
                    className="rounded bg-yellow text-white w-full py-1"
                    onClick={() => setEditFlashcard(c)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded bg-red text-white w-full py-1"
                    onClick={() => setDeleteFlashcard(c)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <PageLoader type="small" />
        )}
      </>
    </>
  );
};

export default checkAuthentication(CourseCards);
