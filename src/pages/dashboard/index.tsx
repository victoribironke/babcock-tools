import HeadTemplate from "@/components/general/HeadTemplate";
import { checkAuthentication } from "@/components/hoc/ProtectedRoute";
import DashboardTemplate from "@/components/dashboard/DashboardTemplate";

const Dashboard = () => {
  return (
    <>
      <HeadTemplate title="Dashboard" />

      <DashboardTemplate>hi</DashboardTemplate>
    </>
  );
};

export default checkAuthentication(Dashboard);
