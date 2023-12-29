import { PracticeModalProps } from "@/types/dashboard";
import { AiOutlineClose } from "react-icons/ai";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { flashcards_for_practice } from "@/atoms/atoms";
import { shuffleArray } from "@/utils/helpers";

const PracticeModal = ({ header, dismiss }: PracticeModalProps) => {
  const [showA, setShowA] = useState(false);
  const [currentQnA, setCurrentQnA] = useState(0);
  const cards = shuffleArray(useRecoilValue(flashcards_for_practice)!);

  const goBack = () => {
    if (currentQnA !== 0) {
      setCurrentQnA((k) => k - 1);
      setShowA(false);
    }
  };

  const goForward = () => {
    if (currentQnA !== cards.length - 1) {
      setCurrentQnA((k) => k + 1);
      setShowA(false);
    }
  };

  return (
    <div
      className="fixed w-full h-screen flex items-center justify-center bg-gray-900 bg-opacity-30 transition-opacity p-2 rs:p-6 z-30"
      onClick={dismiss}
    >
      <div
        className="w-full max-w-xl h-auto max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-lg py-3 px-4 h-fit w-full flex items-center justify-between mb-4">
          <p className="font-medium">
            {header} (question {currentQnA + 1})
          </p>
          <button onClick={dismiss}>
            <AiOutlineClose className="text-lg" />
          </button>
        </div>

        <div className="w-full h-[calc(100vh-16rem)] grid place-items-center text-lg overflow-y-auto py-4 px-6 bg-green text-center text-white rounded-lg">
          {showA
            ? `A: ${cards[currentQnA].answer}`
            : `Q: ${cards[currentQnA].question}`}
        </div>

        <div className="h-fit w-full flex items-center justify-between mt-4 gap-2 sm:gap-4">
          <button
            className="bg-white text-sm sm:text-base rounded-lg py-3 px-2 w-full disabled:cursor-not-allowed hover:scale-105"
            onClick={goBack}
            disabled={currentQnA === 0}
          >
            Previous
          </button>
          <button
            className="bg-white text-sm sm:text-base rounded-lg py-3 px-2 w-full hover:scale-105"
            onClick={() => setShowA((k) => !k)}
          >
            Show {showA ? "question" : "answer"}
          </button>
          <button
            className="bg-white text-sm sm:text-base rounded-lg py-3 px-2 w-full disabled:cursor-not-allowed hover:scale-105"
            onClick={goForward}
            disabled={currentQnA === cards.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeModal;
