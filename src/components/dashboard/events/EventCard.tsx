import { Event } from "@/types/dashboard";
import { getFeesFromTicketPrice } from "@/utils/helpers";
import { BsCalendar3 } from "react-icons/bs";
import { IoLocationSharp } from "react-icons/io5";
import { TbWorldPin } from "react-icons/tb";

const EventCard = ({ event }: { event: Event }) => {
  return (
    <div className="w-full max-w-[18rem] flex gap-3 justify-center flex-col rounded-xl overflow-hidden shadow-md bg-white p-2 border">
      <img
        src={`https://api.dicebear.com/8.x/shapes/svg?seed=${event.name}`}
        alt="Event image"
        className="w-full aspect-video object-cover rounded-lg"
      />

      <p className="text-xl font-medium mb-auto">
        {event.name.slice(0, 50)}
        {event.name.length >= 50 && "..."}
      </p>

      <div className="flex items-center gap-2 text-gray-500">
        <BsCalendar3 className="text-xl" />
        <p>{new Date(event.date_time).toLocaleString()}</p>
      </div>

      <div className="flex items-center gap-2 text-gray-500">
        {event.type === "Physical" ? (
          <IoLocationSharp className="text-xl" />
        ) : (
          <TbWorldPin className="text-xl" />
        )}
        <p>
          {event.type === "Physical"
            ? `${event.location.slice(0, 30)}${
                event.location.length >= 30 ? "..." : ""
              }`
            : "Virtual"}
        </p>
      </div>

      <div className="p-1 flex justify-between items-center">
        <p className="font-medium">
          {event.is_free
            ? "Free"
            : `₦${getFeesFromTicketPrice(parseInt("3500"))}`}
        </p>

        <button className="bg-blue px-3 py-1 rounded-lg text-white">
          Get tickets
        </button>
      </div>
    </div>
  );
};

export default EventCard;
