import { Event } from "@/types/dashboard";
import { separateDateTime } from "@/utils/helpers";
import { BsCalendar3 } from "react-icons/bs";
import { FiClock } from "react-icons/fi";
import { IoLocationSharp } from "react-icons/io5";
import { TbWorldPin } from "react-icons/tb";

const EventDetails = ({ event }: { event: Event }) => {
  const { date, time } = separateDateTime(event.date_time);

  return (
    <>
      <img
        src={`https://api.dicebear.com/8.x/shapes/svg?seed=${event.name}`}
        alt="Event image"
        className="w-full aspect-video object-cover rounded-xl"
      />

      <div className="mt-2 text-3xl font-semibold">{event.name}</div>

      {/* <div className="mt-2 text-xl">{event.description}</div> */}

      <div className="flex items-center gap-2 mt-3 text-lg">
        <div className="bg-blue px-2 py-1 rounded-lg text-white flex gap-2 items-center justify-center">
          <BsCalendar3 /> {date}
        </div>
        <div className="bg-blue px-2 py-1 rounded-lg text-white flex gap-2 items-center justify-center">
          <FiClock /> {time}
        </div>
      </div>

      <div className="w-fit mt-2 bg-blue text-lg px-2 py-1 rounded-lg text-white flex gap-2 items-center justify-center">
        {event.type === "Physical" ? (
          <IoLocationSharp className="text-xl" />
        ) : (
          <TbWorldPin className="text-xl" />
        )}{" "}
        {event.type === "Physical" ? event.location : "Virtual"}
      </div>
    </>
  );
};

export default EventDetails;
