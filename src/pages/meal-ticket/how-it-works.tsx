import HeadTemplate from "@/components/general/HeadTemplate";
import { PAGES } from "@/constants/pages";
import { classNames } from "@/utils/helpers";
import Link from "next/link";

const HowItWorksPage = () => {
  return (
    <>
      <HeadTemplate title="How does the meal ticket tool work?" />

      <BuyTicketInstructions />
      <SellTicketInstructions />
    </>
  );
};

const BuyTicketInstructions = () => {
  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue">
        How to Buy a Ticket:
      </h2>

      <ol className="list-decimal pl-6">
        <li className="mb-2">
          Navigate to the{" "}
          <Link href={PAGES.meal_ticket} className="text-blue">
            tool's page
          </Link>
          .
        </li>
        <li className="mb-2">
          Browse the directory to find tickets. Ideally, choose one where the
          seller is in the same hostel as you, but it's not necessary.
        </li>
        <li className="mb-2">
          After selecting a ticket to buy, click 'Get owner's details.'
        </li>
      </ol>

      <p className="text-gray-800 mt-4">
        When you click 'Get owner's details,' a modal will appear for you to
        enter your email address. Enter it, and the ticket's details, along with
        the owner's information, will be sent to you.
      </p>
    </div>
  );
};

const SellTicketInstructions = () => {
  return (
    <div className="max-w-2xl mx-auto my-8 p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue">
        How to Sell a Ticket:
      </h2>

      <ol className="list-decimal pl-6">
        <li className="mb-2">
          <Link href={PAGES.login} className="text-blue">
            Login{" "}
          </Link>
          to the dashboard and navigate to the tool's page.
        </li>
        <li className="mb-2">Switch to the "Sell a ticket" tab at the top.</li>
        <li className="mb-2">
          Fill in the details of the ticket and click 'Save.'
        </li>
      </ol>

      <p className="text-gray-800 mt-4">
        The ticket will be added to your tickets and the public directory.
      </p>

      <h2 className="text-2xl font-bold mt-6 mb-2 text-blue">Notes:</h2>
      <ol className="list-decimal pl-6">
        <li className="mb-2">
          After the ticket is bought by someone, mark the ticket as sold to
          remove it from the public directory. You can also unmark it as sold.
        </li>
        <li className="mb-2">
          You cannot edit a ticket, so if you put in the wrong details, delete
          the ticket and create a new one.
        </li>
      </ol>
    </div>
  );
};

export default HowItWorksPage;
