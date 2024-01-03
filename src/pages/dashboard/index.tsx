import HeadTemplate from "@/components/general/HeadTemplate";
import { checkAuthentication } from "@/components/hoc/ProtectedRoute";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { IoMailOutline } from "react-icons/io5";
import { LuHome } from "react-icons/lu";
import { RiGraduationCapLine } from "react-icons/ri";
import { FiPhone } from "react-icons/fi";
import { DashboardCardProps, UserDetails } from "@/types/dashboard";
import { getUserDetails } from "@/constants/dashboard";

const Dashboard = () => {
  const [user, setUser] = useState<UserDetails>({
    email: "",
    full_name: "",
    hall_of_residence: "",
    matric_no: "",
    phone_number: "",
  });

  useEffect(() => {
    const user_info = JSON.parse(localStorage.getItem("bt_user_info")!);

    setUser({
      email: user_info.email,
      full_name: user_info.full_name,
      hall_of_residence: user_info.hall_of_residence,
      matric_no: user_info.matric_no,
      phone_number: user_info.phone_number,
    });
  }, []);

  return (
    <>
      <HeadTemplate title="Dashboard" />
      {/* grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 */}

      <div className="w-full flex flex-wrap max-w-7xl items-center justify-center lg:justify-start gap-4">
        {getUserDetails(user).map((u, i) => (
          <Card key={i} icon={u.icon} title={u.title} value={u.value} />
        ))}
      </div>
    </>
  );
};

const Card = (card: DashboardCardProps) => {
  return (
    <div className="p-5 w-full max-w-[22rem] border-2 rounded-lg flex gap-6 items-center">
      <div className="bg-blue bg-opacity-10 p-4 rounded-lg">
        <card.icon className="text-2xl sm:text-3xl text-blue" />
      </div>
      <div>
        <p className="font-medium">{card.title}</p>
        <p className="font-light">{card.value}</p>
      </div>
    </div>
  );
};

export default checkAuthentication(Dashboard);
