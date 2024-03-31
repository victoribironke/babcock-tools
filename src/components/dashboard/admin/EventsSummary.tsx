import { Event } from "@/types/dashboard";

const EventsSummary = ({ events }: { events: Event[] }) => {
  return (
    <>
      <p className="text-lg mb-2 font-medium">Events summary</p>

      <div className="overflow-x-scroll rounded-lg mb-4 border-2 grid grid-cols-1">
        <table className="w-full text-left rtl:text-right">
          <thead className="border-b-2">
            <tr>
              <th
                scope="col"
                className="pl-4 pr-2 py-3 font-medium whitespace-nowrap"
              >
                Event name
              </th>

              <th
                scope="col"
                className="px-2 py-3 font-medium whitespace-nowrap"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-2 py-3 font-medium whitespace-nowrap"
              >
                Date and time
              </th>
              <th
                scope="col"
                className="px-2 py-3 font-medium whitespace-nowrap"
              >
                Attendees / tickets
              </th>
              <th
                scope="col"
                className="pl-2 pr-4 py-3 font-medium whitespace-nowrap"
              >
                Free or paid
              </th>
            </tr>
          </thead>
          {events.length > 0 && (
            <tbody>
              {events.map((e, i) => (
                <tr className="bg-white border-b text-sm" key={i}>
                  <td className="pl-4 pr-2 py-3 whitespace-nowrap">{e.name}</td>

                  <td className="px-2 py-3 whitespace-nowrap">{e.type}</td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {new Date(e.date_time).toLocaleString()}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    {e.attendees} / {e.no_of_tickets}
                  </td>
                  <td className="pl-2 pr-4 py-3 whitespace-nowrap">
                    {e.is_free ? "Free" : "Paid"}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>

        {events.length === 0 && (
          <p className="w-full text-center my-4 text-gray-400 text-sm">
            There are no events.
          </p>
        )}
      </div>
    </>
  );
};
export default EventsSummary;
