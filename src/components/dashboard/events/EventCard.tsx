import { edit_event, event_details } from "@/atoms/atoms";
import { PAGES } from "@/constants/pages";
import { Event } from "@/types/dashboard";
import { getFeesFromTicketPrice } from "@/utils/helpers";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { BsCalendar3 } from "react-icons/bs";
import { FiShare2 } from "react-icons/fi";
import { IoLocationSharp, IoTicketOutline } from "react-icons/io5";
import { LuEye } from "react-icons/lu";
import { MdOutlinePublicOff } from "react-icons/md";
import { TbWorldPin } from "react-icons/tb";
import { SetterOrUpdater, useSetRecoilState } from "recoil";

const EventCard = ({ event }: { event: Event }) => {
  const now = new Date().getTime();
  const e = new Date(event.date_time).getTime();

  const setEditEvent = useSetRecoilState(edit_event);
  const router = useRouter();
  // const isOwner = event.creator === auth.currentUser?.uid;
  const isDashboard = router.pathname.includes("dashboard");
  const isPast = now > e;

  return (
    <div className="w-full max-w-[18rem] flex gap-3 justify-center flex-col rounded-xl overflow-hidden shadow-md bg-white py-2 border">
      <div className="rounded-lg px-2">
        <img
          src={
            event.image
              ? event.image
              : `https://api.dicebear.com/8.x/shapes/svg?seed=${event.name}`
          }
          alt="Event image"
          className="w-full aspect-video object-cover rounded-lg"
        />
      </div>

      <p className="text-xl font-medium mb-auto px-2">
        {event.name.slice(0, 50)}
        {event.name.length >= 50 && "..."}
      </p>

      <div className="flex items-center gap-2 text-gray-500 px-2">
        <BsCalendar3 className="text-xl" />
        <p>{new Date(event.date_time).toLocaleString()}</p>
      </div>

      <div className="flex items-center gap-2 text-gray-500 px-2">
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

      {isDashboard && (
        <div className="flex items-center gap-2 text-gray-500 px-2">
          <IoTicketOutline className="text-lg" />
          <p>
            {event.attendees} / {event.no_of_tickets}
          </p>
        </div>
      )}

      {isDashboard ? (
        <BottomActions
          event={event}
          isDashboard={isDashboard}
          setEditEvent={setEditEvent}
        />
      ) : isPast ? (
        <></>
      ) : (
        <BottomActions
          event={event}
          isDashboard={isDashboard}
          setEditEvent={setEditEvent}
        />
      )}

      {/* (
  <p className="w-full text-center border-t pt-2 text-gray-500">
    This event is over.
  </p>
) */}
    </div>
  );
};

const BottomActions = ({
  event,
  isDashboard,
  setEditEvent,
}: {
  event: Event;
  isDashboard: boolean;
  setEditEvent: SetterOrUpdater<Event | null>;
}) => {
  const price = parseInt(event.price_per_ticket);
  const eventLink = PAGES.base_url + PAGES.event(event.id);
  const setEventDetails = useSetRecoilState(event_details);

  return (
    <div className="flex justify-between items-center border-t pt-2 px-2 gap-3">
      <p className="font-medium mr-auto">
        {event.is_free ? "Free" : `₦${price + getFeesFromTicketPrice(price)}`}
      </p>

      {isDashboard && (
        <>
          <LuEye
            className="text-lg cursor-pointer"
            title="View more"
            onClick={() => setEventDetails(event)}
          />

          <FiShare2
            className="text-lg cursor-pointer"
            title="Copy event link"
            onClick={() => {
              navigator.clipboard
                .writeText(eventLink)
                .then(() => toast.success("Event link copied to clipboard."))
                .catch(() =>
                  toast.error("Error copying event link to clipboard.")
                );
            }}
          />
        </>
      )}

      {!event.public && (
        <MdOutlinePublicOff
          className="text-lg"
          title="This event is not public"
        />
      )}

      {isDashboard ? (
        <button
          className="bg-blue px-3 py-1 rounded-lg text-white"
          onClick={() => setEditEvent(event)}
        >
          Edit event
        </button>
      ) : (
        <Link
          className="bg-blue px-3 py-1 rounded-lg text-white"
          href={PAGES.event(event.id)}
        >
          Get tickets
        </Link>
      )}
    </div>
  );
};

export default EventCard;
