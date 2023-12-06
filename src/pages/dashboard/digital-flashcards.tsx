import { create_flashcard } from "@/atoms/atoms";
import DashboardTemplate from "@/components/dashboard/DashboardTemplate";
import HeadTemplate from "@/components/general/HeadTemplate";
import { checkAuthentication } from "@/components/hoc/ProtectedRoute";
import Link from "next/link";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useEffect, useState, useRef } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/services/firebase";
import PageLoader from "@/components/general/PageLoader";
import { SummarizedCard } from "@/types/dashboard";
import Modal from "@/components/general/Modal";
import CreateFlashcard from "@/components/dashboard/digital-flashcards/CreateFlashcard";

const DigitalFlashcardsDashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [cards, setCards] = useState<SummarizedCard[]>([]);
  const cards_cont_ref = useRef<HTMLDivElement>(null);

  const [createFlashcard, setCreateFlashcard] =
    useRecoilState(create_flashcard);

  useEffect(() => {
    const temp_cards: SummarizedCard[] = [];

    const unsub = onSnapshot(
      doc(db, "flashcards", auth.currentUser!.uid),
      (doc) => {
        if (!doc.exists()) {
          setIsEmpty(true);
          setIsLoading(false);
          return;
        }

        while (cards_cont_ref.current?.firstChild) {
          cards_cont_ref.current?.removeChild(
            cards_cont_ref.current?.firstChild
          );
        }

        const flashcards = doc.data();
        for (let i in flashcards) {
          temp_cards.push({
            count: flashcards[i].length,
            course_code: i.split("_").join(" "),
          });
        }

        setCards(temp_cards);
        setIsLoading(false);
      }
    );

    return unsub;
  }, []);

  return (
    <>
      <HeadTemplate title="Digital flashcards" />
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
          isEmpty ? (
            <p className="w-full text-center mt-6 opacity-70">
              You don&apos;t have any flashcards.
            </p>
          ) : (
            <div
              className="w-full flex flex-wrap items-center justify-center mt-5 gap-2"
              ref={cards_cont_ref}
            >
              {cards.map((c, i) => (
                <button
                  className="p-4 w-fit rounded-lg border bg-white hover:shadow-md cursor-pointer"
                  key={i}
                >
                  <p className="text-lg sm:text-xl font-medium">
                    {c.course_code}
                  </p>

                  <div className="w-full text-center text-3xl sm:text-4xl font-semibold mt-4 text-blue">
                    {c.count}
                  </div>
                </button>
              ))}
            </div>
          )
        ) : (
          <PageLoader type="small" />
        )}
      </DashboardTemplate>

      <Link
        href="https://www.twinkl.com.ng/teaching-wiki/flashcards"
        target="_blank"
        className="bg-blue text-white py-1 px-3 rounded-md hover:underline fixed bottom-4 right-4"
      >
        What are flashcards?
      </Link>

      {createFlashcard && (
        <Modal
          header="Create a new flashcard"
          dismiss={() => setCreateFlashcard(false)}
        >
          <CreateFlashcard course_codes={cards.map((c) => c.course_code)} />
        </Modal>
      )}
    </>
  );
};

export default checkAuthentication(DigitalFlashcardsDashboardPage);
