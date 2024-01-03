import { create_flashcard } from "@/atoms/atoms";
import HeadTemplate from "@/components/general/HeadTemplate";
import { checkAuthentication } from "@/components/hoc/ProtectedRoute";
import Link from "next/link";
import { useSetRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/services/firebase";
import PageLoader from "@/components/general/PageLoader";
import { SummarizedCard } from "@/types/dashboard";
import { PAGES } from "@/constants/pages";

const DigitalFlashcardsDashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [cards, setCards] = useState<SummarizedCard[]>([]);
  const setCreateFlashcard = useSetRecoilState(create_flashcard);

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

      <div className="flex justify-between items-center w-full max-w-5xl">
        <p className="font-medium text-lg">Your flashcards</p>

        <button
          className="bg-green text-white py-1 px-3 rounded-md"
          onClick={() => setCreateFlashcard(cards)}
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
          <div className="w-full grid max-w-5xl grid-cols-1 rs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-5 gap-3">
            {cards.map((c, i) => (
              <Link
                href={PAGES.flashcards_for_course(c.course_code)}
                className="p-4 w-full rounded-lg border bg-white hover:shadow-md cursor-pointer"
                key={i}
              >
                <p className="text-lg sm:text-xl font-medium w-full text-center">
                  {c.course_code}
                </p>

                <div className="w-full text-center text-3xl sm:text-4xl font-semibold mt-4 text-blue">
                  {c.count}
                </div>
              </Link>
            ))}
          </div>
        )
      ) : (
        <PageLoader type="full" />
      )}

      <Link
        href="https://www.twinkl.com.ng/teaching-wiki/flashcards"
        target="_blank"
        className="bg-blue text-white py-1 px-3 rounded-md hover:underline fixed bottom-4 right-4"
      >
        What are flashcards?
      </Link>
    </>
  );
};

export default checkAuthentication(DigitalFlashcardsDashboardPage);
