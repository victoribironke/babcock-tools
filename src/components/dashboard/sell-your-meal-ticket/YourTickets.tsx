import PageLoader from "@/components/general/PageLoader";
import { YourTicketsProps } from "@/types/dashboard";
import Ticket from "./Ticket";

const YourTickets = ({ loading, noTickets, tickets }: YourTicketsProps) => {
  if (loading) {
    return <PageLoader type="small" />;
  }

  if (noTickets) {
    return (
      <p className="w-full text-center mt-6 opacity-70">
        You don&apos;t have any tickets.
      </p>
    );
  }

  return (
    <div className="mt-6 flex flex-wrap gap-2 w-full items-center justify-center">
      {tickets.map((ticket, i) => (
        <Ticket ticket={ticket} key={i} />
      ))}
    </div>
  );
};

export default YourTickets;
