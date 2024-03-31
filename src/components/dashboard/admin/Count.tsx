import { CgProfile } from "react-icons/cg";
import { IoFastFoodOutline } from "react-icons/io5";

const Count = ({ users, orders }: { users: number; orders: number }) => {
  return (
    <div className="w-full mb-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
      <div className="p-5 w-full max-w-[22rem] border-2 rounded-lg flex gap-6 items-center">
        <div className="bg-blue bg-opacity-10 p-4 rounded-lg">
          <CgProfile className="text-2xl sm:text-3xl text-blue" />
        </div>
        <div>
          <p className="font-medium">Number of users</p>
          <p className="font-light">{users}</p>
        </div>
      </div>

      <div className="p-5 w-full max-w-[22rem] border-2 rounded-lg flex gap-6 items-center">
        <div className="bg-blue bg-opacity-10 p-4 rounded-lg">
          <IoFastFoodOutline className="text-2xl sm:text-3xl text-blue" />
        </div>
        <div>
          <p className="font-medium">Number of orders</p>
          <p className="font-light">{orders}</p>
        </div>
      </div>
    </div>
  );
};

export default Count;
