import { checkAuthentication } from "@/components/hoc/ProtectedRoute";

const CafeteriaDeliveryPage = () => {
  return <div>hi</div>;
};

export default checkAuthentication(CafeteriaDeliveryPage);
