import { Order } from "@/types/dashboard";
import { formatNumber, getOrdersByMealType } from "@/utils/helpers";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const OrdersByMealType = ({ orders }: { orders: Order[] }) => {
  return (
    <div className="w-full pt-4 mb-5 pr-6 pb-2 rounded-lg border-2">
      <p className="w-full pl-10 pb-4 font-medium text-lg">
        Number of orders by meal type
      </p>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={getOrdersByMealType(orders)}>
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

export default OrdersByMealType;
