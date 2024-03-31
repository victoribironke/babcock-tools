import HeadTemplate from "@/components/general/HeadTemplate";
import Header from "@/components/general/Header";
import Hero from "@/components/general/Hero";
import Tools from "@/components/general/Tools";

const Home = () => {
  return (
    <>
      <HeadTemplate />

      <Header />

      <section className="w-full max-w-5xl px-6 pb-12">
        <Hero />
        <Tools />
      </section>
    </>
  );
};

export default Home;
