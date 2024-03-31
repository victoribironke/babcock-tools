import { User } from "@/types/dashboard";
import { formatNumber, getUsersByHall } from "@/utils/helpers";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const UsersByHall = ({ users }: { users: User[] }) => {
  return (
    <div className="w-full pt-4 mb-5 pr-6 pb-2 rounded-lg border-2">
      <p className="w-full pl-10 pb-4 font-medium text-lg">
        Number of users by hall
      </p>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={getUsersByHall(users)}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={16}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={16}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={false}
            formatter={(k) => formatNumber(k as number)}
          />
          <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsersByHall;
