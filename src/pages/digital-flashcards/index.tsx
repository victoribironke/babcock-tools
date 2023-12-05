import HeadTemplate from "@/components/general/HeadTemplate";
import Header from "@/components/meal-ticket/Header";
import Tickets from "@/components/meal-ticket/Tickets";

const DigitalFlashcardsPage = () => {
  return (
    <>
      <HeadTemplate title="Digital flashcards" />

      <section className="w-full max-w-4xl px-4 sm:px-8 py-12">
        <Header />
        <Tickets />
      </section>
    </>
  );
};

export default DigitalFlashcardsPage;
