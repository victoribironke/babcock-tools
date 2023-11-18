import HeadTemplate from "@/components/general/HeadTemplate";
import Header from "@/components/meal-ticket/Header";
import Tickets from "@/components/meal-ticket/Tickets";

const MealTicketPage = () => {
  return (
    <>
      <HeadTemplate title="Buy a meal ticket" />

      <section className="w-full max-w-3xl px-4 sm:px-8 py-12">
        <Header />
        <Tickets />
      </section>
    </>
  );
};

export default MealTicketPage;
