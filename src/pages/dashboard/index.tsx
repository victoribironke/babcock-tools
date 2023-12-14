import HeadTemplate from "@/components/general/HeadTemplate";
import { checkAuthentication } from "@/components/hoc/ProtectedRoute";
import DashboardTemplate from "@/components/dashboard/DashboardTemplate";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { auth, db } from "@/services/firebase";
import PageLoader from "@/components/general/PageLoader";
import { CgProfile } from "react-icons/cg";
import { IoMailOutline } from "react-icons/io5";
import { LuHome } from "react-icons/lu";
import { RiGraduationCapLine } from "react-icons/ri";
import { FiPhone } from "react-icons/fi";
import { UserDetails } from "@/types/dashboard";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserDetails>({
    email: "",
    full_name: "",
    hall_of_residence: "",
    matric_no: "",
    phone_number: "",
  });

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const data = await (
          await getDoc(doc(db, "users", auth.currentUser!.uid))
        ).data()!;

        setUser({
          email: data.email,
          full_name: data.full_name,
          hall_of_residence: data.hall_of_residence,
          matric_no: data.matric_no,
          phone_number: data.phone_number,
        });
      } catch (e: any) {
        toast.error(`Error: ${e.code.split("/")[1]}.`);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <HeadTemplate title="Dashboard" />

      <DashboardTemplate>
        {loading && <PageLoader type="small" />}

        {!loading && (
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
        )}
      </DashboardTemplate>
    </>
  );
};

export default checkAuthentication(Dashboard);
