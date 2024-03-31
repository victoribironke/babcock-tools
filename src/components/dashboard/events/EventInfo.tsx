import { Event } from "@/types/dashboard";
import { separateDateTime } from "@/utils/helpers";
import { BsCalendar3 } from "react-icons/bs";
import { FiClock } from "react-icons/fi";
import { IoLocationSharp } from "react-icons/io5";
import { TbWorldPin } from "react-icons/tb";

const EventInfo = ({ event }: { event: Event }) => {
  const { date, time } = separateDateTime(event.date_time);

  return (
    <>
      <img
        src={
          event.image ??
          `https://api.dicebear.com/8.x/shapes/svg?seed=${event.name}`
        }
        alt="Event image"
        className="w-full aspect-video object-cover rounded-xl"
      />

      <div className="mt-2 text-2xl rs:text-3xl font-semibold">
        {event.name}
      </div>

      <div className="flex items-center gap-2 mt-3 rs:text-lg flex-wrap">
        <div className="bg-blue px-2 py-1 rounded-lg text-white flex gap-2 items-center justify-center">
          <BsCalendar3 /> {date}
        </div>
        <div className="bg-blue px-2 py-1 rounded-lg text-white flex gap-2 items-center justify-center">
          <FiClock /> {time}
        </div>
        <div className="w-fit bg-blue rs:text-lg px-2 py-1 rounded-lg text-white flex gap-2 items-center justify-center">
          {event.type === "Physical" ? <IoLocationSharp /> : <TbWorldPin />}{" "}
          {event.type === "Physical" ? event.location : "Virtual"}
        </div>
      </div>

      <hr className="mt-4 mb-2" />

      <p className="font-medium text-xl rs:text-2xl">About this event</p>

      <div className="mt-1 text-base rs:text-lg text-gray-500">
        {event.description}
      </div>
    </>
  );
};

export default EventInfo;
