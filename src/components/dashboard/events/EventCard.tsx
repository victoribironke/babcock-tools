import { Event } from "@/types/dashboard";
import { getFeesFromTicketPrice } from "@/lib/utils";
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
import { PAGES } from "@/constants/constants";
import EditEvent from "./EditEvent";

const EventCard = ({ event }: { event: Event }) => {
  const now = new Date().getTime();
  const e = new Date(event.date_time).getTime();

  const router = useRouter();
  // const isOwner = event.creator === auth.currentUser?.uid;
  const isDashboard = router.pathname.includes("dashboard");
  const isPast = now > e;

  return (
    <div className="w-full flex gap-3 justify-center flex-col rounded-xl overflow-hidden bg-white py-2 border">
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

      <p className="font-medium mb-auto px-2">
        {event.name.slice(0, 50)}
        {event.name.length >= 50 && "..."}
      </p>

      <div className="flex items-center gap-2 text-gray-500 px-2 text-sm">
        <BsCalendar3 />
        <p>{new Date(event.date_time).toLocaleString()}</p>
      </div>

      <div className="flex items-center gap-2 text-gray-500 px-2 text-sm">
        {event.type === "physical" ? (
          <IoLocationSharp className="text-lg" />
        ) : (
          <TbWorldPin className="text-lg" />
        )}
        <p>
          {event.type === "physical"
            ? `${event.location.slice(0, 30)}${
                event.location.length >= 30 ? "..." : ""
              }`
            : "Virtual"}
        </p>
      </div>

      {isDashboard && (
        <div className="flex items-center gap-2 text-gray-500 px-2 text-sm">
          <IoTicketOutline className="text-lg" />
          <p>
            {event.attendees} / {event.no_of_tickets || "Unlimited"}
          </p>
        </div>
      )}

      {(!isPast || isDashboard) && (
        <BottomActions e={event} isDash={isDashboard} />
      )}
    </div>
  );
};

const BottomActions = ({ e, isDash }: { e: Event; isDash: boolean }) => {
  const price = parseInt(e.price_per_ticket);
  const eventLink = PAGES.base_url + PAGES.event(e.id);

  return (
    <div className="flex justify-between items-center border-t pt-2 px-3 gap-4">
      <p className="mr-auto">
        {e.is_free ? "Free" : `₦${price + getFeesFromTicketPrice(price)}`}
      </p>

      {isDash && (
        <>
          <Link href={PAGES.dashboard_event(e.id)}>
            <LuEye className="cursor-pointer" title="View more" />
          </Link>

          <FiShare2
            className="cursor-pointer"
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

      {!e.public && <MdOutlinePublicOff title="This event is not public" />}

      {isDash ? (
        <EditEvent event={e} />
      ) : (
        <Link
          className="bg-main px-3 py-1 rounded-lg text-white"
          href={PAGES.event(e.id)}
        >
          Get tickets
        </Link>
      )}
    </div>
  );
};

export default EventCard;
