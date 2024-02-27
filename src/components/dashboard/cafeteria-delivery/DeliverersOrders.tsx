import { edit_order_status } from "@/atoms/atoms";
import { DeliverersOrdersProps } from "@/types/dashboard";
import { classNames, getTodaysDate, parseDate } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

const DeliverersOrders = ({ orders, users }: DeliverersOrdersProps) => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const new_orders = orders
    .map((o) => {
      return {
        ...o,
        orderer_name: users.find((u) => u.uid === o.orderer_id)?.full_name,
      };
    })
    .filter(
      (o) =>
        o.meal_type.toLowerCase().includes(filter.toLowerCase()) ||
        o.orderer_name?.toLowerCase().includes(filter.toLowerCase()) ||
        o.room_number.toLowerCase().includes(filter.toLowerCase()) ||
        o.status.toLowerCase().includes(filter.toLowerCase())
    );
  const setEditOrderStatus = useSetRecoilState(edit_order_status);
  const d = new_orders.length / 10;
  const c = Number.isInteger(d)
    ? page !== Math.floor(d)
    : page !== Math.floor(d) + 1;

  useEffect(() => setPage(1), [filter]);

  return (
    <>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search for a meal type, orderer's name, room number, status..."
        className="w-full max-w-lg border-2 border-blue outline-none py-2 px-3 rounded-lg bg-white mt-6"
      />

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
                Orderer&apos;s name
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
                Room number
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
                    {o.orderer_name}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {parseDate(o.ticket_date) as string}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {o.room_number}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    <div
                      className={classNames(
                        "py-1 px-3 rounded text-white w-fit",
                        o.status === "Delivered" && "bg-green",
                        o.status === "Not delivered" && "bg-yellow",
                        o.status === "Cancelled" && "bg-red"
                      )}
                    >
                      {o.status}
                    </div>
                  </td>
                  <td className="pl-2 pr-4 py-3 whitespace-nowrap">
                    {o.status === "Not delivered" &&
                      o.date_ordered === getTodaysDate() && (
                        <button
                          className="bg-red py-1 px-3 rounded text-white"
                          onClick={() => setEditOrderStatus(`${o.id}|cancel`)}
                        >
                          Cancel order
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

export default DeliverersOrders;
