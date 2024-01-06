import { PAGES } from "@/constants/pages";
import { useRouter } from "next/router";
import { useEffect } from "react";

const CafeteriaDeliveryPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push(PAGES.cafeteria_delivery);
  }, []);

  return <></>;
};
export default CafeteriaDeliveryPage;
