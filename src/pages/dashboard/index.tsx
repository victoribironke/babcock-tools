import HeadTemplate from "@/components/general/HeadTemplate";
import { checkAuthentication } from "@/components/hoc/ProtectedRoute";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { IoMailOutline } from "react-icons/io5";
import { LuHome } from "react-icons/lu";
import { RiGraduationCapLine } from "react-icons/ri";
import { FiPhone } from "react-icons/fi";
import { UserDetails } from "@/types/dashboard";

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

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 max-w-5xl gap-4">
        <div className="p-4 w-full border shadow rounded-lg flex gap-4 items-center">
          <CgProfile className="text-5xl text-blue" />
          <div>
            <p className="font-medium">Name</p>
            <p className="font-light">{user.full_name}</p>
          </div>
        </div>

        <div className="p-4 w-full border shadow-md rounded-lg flex gap-4 items-center">
          <IoMailOutline className="text-5xl text-blue" />
          <div>
            <p className="font-medium">Email address</p>
            <p className="font-light">{user.email}</p>
          </div>
        </div>

        <div className="p-4 w-full border shadow-md rounded-lg flex gap-4 items-center">
          <LuHome className="text-5xl text-blue" />
          <div>
            <p className="font-medium">Hall of residence</p>
            <p className="font-light">{user.hall_of_residence}</p>
          </div>
        </div>

        <div className="p-4 w-full border shadow-md rounded-lg flex gap-4 items-center">
          <RiGraduationCapLine className="text-5xl text-blue" />
          <div>
            <p className="font-medium">Matric number / app id</p>
            <p className="font-light">{user.matric_no}</p>
          </div>
        </div>

        <div className="p-4 w-full border shadow-md rounded-lg flex gap-4 items-center">
          <FiPhone className="text-5xl text-blue" />
          <div>
            <p className="font-medium">Phone number</p>
            <p className="font-light">{user.phone_number}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default checkAuthentication(Dashboard);
