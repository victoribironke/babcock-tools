import { FreeOrderSummary } from "@/types/dashboard";
import { getTodaysDate, parseDate } from "@/utils/helpers";

const FreeOrders = ({ freeOrders }: { freeOrders: FreeOrderSummary[] }) => {
  return (
    <>
      <p className="text-lg mb-2 font-medium">
        Free orders for {parseDate(getTodaysDate()) as string}
      </p>

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
                className="pl-2 pr-4 py-3 font-medium whitespace-nowrap"
              >
                Amount
              </th>
            </tr>
          </thead>
          {freeOrders.length > 0 && (
            <tbody>
              {freeOrders.map((f, i) => (
                <tr className="bg-white border-b text-sm" key={i}>
                  <td className="pl-4 pr-2 py-3 whitespace-nowrap">
                    {f.deliverers_name}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">{f.email}</td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {f.bank_details?.bank_name}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {f.bank_details?.account_number}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {f.bank_details?.account_name}
                  </td>
                  <td className="pl-2 pr-4 py-3 whitespace-nowrap">
                    {f.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          )}{" "}
        </table>

        {freeOrders.length === 0 && (
          <p className="w-full text-center my-4 text-gray-400 text-sm">
            There are no free orders for today.
          </p>
        )}
      </div>
    </>
  );
};

export default FreeOrders;
