import HeadTemplate from "@/components/general/HeadTemplate";
import Hero from "@/components/general/Hero";
import Tools from "@/components/general/Tools";

const Home = () => {
  return (
    <>
      <HeadTemplate />

      <section className="w-full max-w-5xl px-4 sm:px-8 pt-12">
        <Hero />
        <Tools />
      </section>
    </>
  );
};

export default Home;
