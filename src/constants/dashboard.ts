import { DashboardCardProps, UserDetails } from "@/types/dashboard";
import { CgProfile } from "react-icons/cg";
import { FiPhone } from "react-icons/fi";
import { IoMailOutline } from "react-icons/io5";
import { LuHome } from "react-icons/lu";
import { RiGraduationCapLine } from "react-icons/ri";

export const getUserDetails = (user: UserDetails) => {
  const userArr: DashboardCardProps[] = [
    {
      icon: CgProfile,
      title: "Name",
      value: user.full_name,
    },
    {
      icon: IoMailOutline,
      title: "Email address",
      value: user.email,
    },
    {
      icon: LuHome,
      title: "Hall of residence",
      value: user.hall_of_residence,
    },
    {
      icon: RiGraduationCapLine,
      title: "Matric number / app id",
      value: user.matric_no,
    },
    {
      icon: FiPhone,
      title: "Phone number",
      value: user.phone_number,
    },
  ];

  return userArr;
};