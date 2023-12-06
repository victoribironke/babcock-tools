import { create_flashcard } from "@/atoms/atoms";
import DashboardTemplate from "@/components/dashboard/DashboardTemplate";
import CreateFlashcard from "@/components/dashboard/digital-flashcards/CreateFlashcard";
import CreateFlashcardWithoutCourseSelect from "@/components/dashboard/digital-flashcards/CreateFlashcardWithoutCourseSelect";
import DeleteFlashcard from "@/components/dashboard/digital-flashcards/DeleteFlashcard";
import EditFlashcard from "@/components/dashboard/digital-flashcards/EditFlashcard";
import HeadTemplate from "@/components/general/HeadTemplate";
import Modal from "@/components/general/Modal";
import PageLoader from "@/components/general/PageLoader";
import { checkAuthentication } from "@/components/hoc/ProtectedRoute";
import { auth, db } from "@/services/firebase";
import { FullFlashcard } from "@/types/dashboard";
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";

const CourseCards = () => {
  const router = useRouter();
  const { course_code } = router.query;
  const [cards, setCards] = useState<FullFlashcard[]>([]);
  const [card, setCard] = useState<FullFlashcard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [createFlashcard, setCreateFlashcard] = useState(false);
  const [deleteFlashcard, setDeleteFlashcard] = useState<FullFlashcard | null>(
    null
  );

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "flashcards", auth.currentUser!.uid),
      (doc) => {
        const flashcards = doc.data()!;
        const code = (course_code as string)
          ?.split("-")
          .join("_")
          .toUpperCase();

        setCards(flashcards[code]);
        setIsLoading(false);
      }
    );

    return unsub;
  }, [router]);

  return (
    <>
      <HeadTemplate
        title={`Digital flashcards — ${(course_code as string)
          ?.split("-")
          .join(" ")
          .toUpperCase()}`}
      />
      <DashboardTemplate>
        <div className="flex justify-between items-center w-full">
          <p className="font-medium text-lg">Your flashcards</p>

          <button
            className="bg-green text-white py-1 px-3 rounded-md"
            onClick={() => setCreateFlashcard(true)}
          >
            Create flashcard
          </button>
        </div>

        {!isLoading ? (
          <div className="w-full mt-5 gap-3 grid grid-cols-1 rs:grid-cols-2 lg:grid-cols-3">
            {cards.map((c, i) => (
              <div className="bg-white rounded-lg shadow-md p-2 border" key={i}>
                <p className="w-full h-[calc(100%-2.55rem)] bg-green text-white rounded flex items-center justify-center mb-2 p-4">
                  {c.question}
                </p>

                <div className="w-full flex gap-2">
                  <button
                    className="rounded bg-yellow text-white w-full py-1"
                    onClick={() => setCard(c)}
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
      </DashboardTemplate>

      {createFlashcard && (
        <Modal
          header="Create a new flashcard"
          dismiss={() => setCreateFlashcard(false)}
        >
          <CreateFlashcardWithoutCourseSelect
            course_code={(course_code as string)
              ?.split("-")
              .join(" ")
              .toUpperCase()}
            close={setCreateFlashcard}
          />
        </Modal>
      )}

      {deleteFlashcard && (
        <Modal
          header="Delete a flashcard"
          dismiss={() => setDeleteFlashcard(null)}
        >
          <DeleteFlashcard
            details={deleteFlashcard}
            close={setDeleteFlashcard}
            course_code={(course_code as string)
              ?.split("-")
              .join(" ")
              .toUpperCase()}
          />
        </Modal>
      )}

      {card && (
        <Modal header="Edit a flashcard" dismiss={() => setCard(null)}>
          <EditFlashcard
            course_code={(course_code as string)
              ?.split("-")
              .join(" ")
              .toUpperCase()}
            details={card}
            close={setCard}
          />
        </Modal>
      )}
    </>
  );
};

export default checkAuthentication(CourseCards);
