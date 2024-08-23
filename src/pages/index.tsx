import { PAGES } from "@/constants/constants";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home = () => {
  const { push } = useRouter();

  useEffect(() => {
    push(PAGES.dashboard);
  }, []);

  return <></>;
};

export default Home;
