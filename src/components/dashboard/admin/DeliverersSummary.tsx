import { Summary } from "@/types/dashboard";
import { formatNumber } from "@/utils/helpers";
import { Dispatch, SetStateAction } from "react";

const DeliverersSummary = ({
  showToday,
  setShowToday,
  summary,
}: {
  showToday: boolean;
  setShowToday: Dispatch<SetStateAction<boolean>>;
  summary: Summary[];
}) => {
  return (
    <>
      <div className="flex gap-4 items-center mb-2">
        <p className="text-lg font-medium">Deliverers summary</p>

        <button
          className="bg-blue text-white text-sm py-1 px-3 rounded-md"
          onClick={() => setShowToday((k) => !k)}
        >
          {showToday ? "Show all" : "Show today"}
        </button>
      </div>

      <div className="overflow-x-scroll rounded-lg mb-4 border-2 grid grid-cols-1">
        <table className="w-full text-left rtl:text-right">
          <thead className="border-b-2">
            <tr>
              <th
                scope="col"
                className="pl-4 pr-2 py-3 font-medium whitespace-nowrap"
              >
                Deliverer&apos;s name
              </th>
              {showToday && (
                <>
                  <th
                    scope="col"
                    className="px-2 py-3 font-medium whitespace-nowrap"
                  >
                    Email address
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 font-medium whitespace-nowrap"
                  >
                    Bank name
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 font-medium whitespace-nowrap"
                  >
                    Account number
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 font-medium whitespace-nowrap"
                  >
                    Account name
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 font-medium whitespace-nowrap"
                  >
                    Amount due
                  </th>
                </>
              )}
              <th
                scope="col"
                className="px-2 py-3 font-medium whitespace-nowrap"
              >
                Hostel
              </th>
              <th
                scope="col"
                className="px-2 py-3 font-medium whitespace-nowrap"
              >
                Orders
              </th>
              <th
                scope="col"
                className="pl-2 pr-4 py-3 font-medium whitespace-nowrap"
              >
                (D) (Nd) (C)
              </th>
            </tr>
          </thead>
          {summary.length > 0 && (
            <tbody>
              {summary.map((s, i) => (
                <tr className="bg-white border-b text-sm" key={i}>
                  <td className="pl-4 pr-2 py-3 whitespace-nowrap">
                    {s.deliverers_name}
                  </td>
                  {showToday && (
                    <>
                      <td className="px-2 py-3 whitespace-nowrap">{s.email}</td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        {s.bank_details.bank_name}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        {s.bank_details.account_number}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        {s.bank_details.account_name}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        ₦ {formatNumber(s.amount_due)}
                      </td>
                    </>
                  )}
                  <td className="px-2 py-3 whitespace-nowrap">{s.hostel}</td>
                  <td className="px-2 py-3 whitespace-nowrap">{s.orders}</td>
                  <td className="pl-2 pr-4 py-3 whitespace-nowrap">
                    ({s.delivered}) ({s.not_delivered}) ({s.cancelled})
                  </td>
                </tr>
              ))}
            </tbody>
          )}{" "}
        </table>

        {summary.length === 0 && (
          <p className="w-full text-center my-4 text-gray-400 text-sm">
            There are no deliverers.
          </p>
        )}
      </div>
    </>
  );
};

export default DeliverersSummary;
