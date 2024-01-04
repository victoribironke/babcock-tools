import { edit_order_status } from "@/atoms/atoms";
import { PastOrdersProps } from "@/types/dashboard";
import { classNames, parseDate } from "@/utils/helpers";
import { useState } from "react";
import { useSetRecoilState } from "recoil";

const PastOrders = ({ orders, deliverers }: PastOrdersProps) => {
  const [page, setPage] = useState(1);
  const new_orders = orders.map((o) => {
    return {
      ...o,
      deliverer_name: deliverers.find((d) => d.uid === o.deliverer_id)
        ?.full_name,
    };
  });
  const setEditOrderStatus = useSetRecoilState(edit_order_status);

  const d = new_orders.length / 10;
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
                className="pl-4 pr-2 py-3 font-medium whitespace-nowrap"
              >
                Meal type
              </th>
              <th
                scope="col"
                className="px-2 py-3 font-medium whitespace-nowrap"
              >
                Deliverer&apos;s name
              </th>
              <th
                scope="col"
                className="px-2 py-3 font-medium whitespace-nowrap"
              >
                Ticket&apos;s date
              </th>
              <th
                scope="col"
                className="px-2 py-3 font-medium whitespace-nowrap"
              >
                Date ordered
              </th>
              <th
                scope="col"
                className="px-2 py-3 font-medium whitespace-nowrap"
              >
                Status
              </th>
              <th scope="col" className="pl-2 pr-4 py-3 font-medium"></th>
            </tr>
          </thead>

          {new_orders.length > 0 && (
            <tbody>
              {new_orders.slice(page * 10 - 10, page * 10).map((o, i) => (
                <tr className="bg-white border-b text-sm" key={i}>
                  <td className="pl-4 pr-2 py-3 whitespace-nowrap">
                    {o.meal_type}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {o.deliverer_name}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {parseDate(o.ticket_date) as string}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {parseDate(o.date_ordered) as string}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    <div
                      className={classNames(
                        "py-1 px-3 rounded text-white w-fit",
                        o.status === "Delivered" ? "bg-green" : "bg-yellow"
                      )}
                    >
                      {o.status}
                    </div>
                  </td>
                  <td className="pl-2 pr-4 py-3 whitespace-nowrap">
                    {o.status === "Not delivered" && (
                      <button
                        className="bg-blue py-1 px-3 rounded text-white"
                        onClick={() => setEditOrderStatus(o.id)}
                      >
                        Edit status
                      </button>
                    )}
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
                ? new_orders.length < 10
                  ? new_orders.length
                  : page * 10
                : new_orders.length}{" "}
              of {new_orders.length} results
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
