import { Order } from "@/types/dashboard";
import { parseDate } from "@/utils/helpers";
import { useState } from "react";

const PastOrders = ({ orders }: { orders: Order[] }) => {
  const [page, setPage] = useState(1);

  const d = orders.length / 10;
  const c = Number.isInteger(d)
    ? page !== Math.floor(d)
    : page !== Math.floor(d) + 1;

  return (
    <>
      <div className="overflow-x-scroll max-w-3xl shadow-md rounded-lg mt-6 border grid grid-cols-1">
        <table className="w-full text-left rtl:text-right">
          <thead className="border-b-2">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 font-medium whitespace-nowrap"
              >
                Meal type
              </th>
              <th
                scope="col"
                className="px-4 py-3 font-medium whitespace-nowrap"
              >
                Deliverer's name
              </th>
              <th
                scope="col"
                className="px-4 py-3 font-medium whitespace-nowrap"
              >
                Date ordered
              </th>
              <th
                scope="col"
                className="px-4 py-3 font-medium whitespace-nowrap"
              >
                Status
              </th>
              <th scope="col" className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>

          {orders.length > 0 && (
            <tbody>
              {orders.slice(page * 10 - 10, page * 10).map((o, i) => (
                <tr className="bg-white border-b text-sm" key={i}>
                  <td className="px-4 py-3 whitespace-nowrap">{o.meal_type}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {o.deliverer.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {parseDate(o.date_ordered) as string}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="bg-green py-1 px-3 rounded text-white">
                      {o.status}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button className="bg-blue py-1 px-3 rounded text-white">
                      Edit status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>

        {orders.length === 0 && (
          <p className="w-full text-center my-4 text-gray-400 text-sm">
            You have no previous orders.
          </p>
        )}

        {orders.length > 0 && (
          <div className="border-b rounded-lg p-4 flex items-center justify-center gap-2 flex-col rs:flex-row">
            <p className="text-sm rs:mr-auto">
              Showing {page * 10 - 9} to{" "}
              {c
                ? orders.length < 10
                  ? orders.length
                  : page * 10
                : orders.length}{" "}
              of {orders.length} results
            </p>

            <div className="flex gap-2">
              <button
                className="text-sm border py-1.5 px-3 shadow rounded-md hover:shadow-md disabled:cursor-not-allowed"
                onClick={() => page !== 1 && setPage((p) => p - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              <button
                className="text-sm border py-1.5 px-3 shadow rounded-md hover:shadow-md disabled:cursor-not-allowed"
                onClick={() => c && setPage((p) => p + 1)}
                disabled={!c}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PastOrders;
