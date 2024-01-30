import HeadTemplate from "@/components/general/HeadTemplate";
import { PAGES } from "@/constants/pages";
import Link from "next/link";

const HowItWorksPageCD = () => {
  return (
    <>
      <HeadTemplate title="How the cafeteria delivery tool works" />

      <StudentInstructions />
      <DelivererInstructions />
    </>
  );
};

const StudentInstructions = () => {
  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue">
        For Orderers (Students):
      </h2>
      <ol className="list-decimal pl-6">
        <li className="mb-2">
          Login and Access Tool:
          <ul className="list-disc pl-6">
            <li>
              <Link href={PAGES.login} className="text-blue">
                Login{" "}
              </Link>
              to your dashboard and find the tool&apos;s page.
            </li>
          </ul>
        </li>
        <li className="mb-2">
          Place Your Order:
          <ul className="list-disc pl-6">
            <li>
              Complete the order form with details like meal type, room number,
              and ticket date.
            </li>
            <li>Choose a deliverer from the available options.</li>
          </ul>
        </li>
        <li className="mb-2">
          Make Payment:
          <ul className="list-disc pl-6">
            <li>
              After selecting a deliverer, proceed to the payment section and
              pay the specified amount.
            </li>
          </ul>
        </li>
        <li className="mb-2">
          Order Confirmation:
          <ul className="list-disc pl-6">
            <li>
              Receive a confirmation notification indicating that your order has
              been confirmed.
            </li>
          </ul>
        </li>
      </ol>

      <div className="mt-6">
        <h3 className="text-xl font-bold mb-2 text-blue">Notes:</h3>
        <ul className="list-disc pl-6">
          <li className="mb-1">
            Ensure you are in the specified room for delivery when the deliverer
            arrives.
          </li>
          <li className="mb-1">
            Place your order at least an hour before the meal service starts.
          </li>
          <li className="mb-1">View all your orders on your dashboard.</li>
          <li className="mb-1">
            Set the order status to &apos;Delivered&apos; only after receiving
            your order, as this action cannot be undone.
          </li>
        </ul>
      </div>
    </div>
  );
};

const DelivererInstructions = () => {
  return (
    <div className="max-w-2xl mx-auto my-8 p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue">For Deliverers:</h2>
      <ol className="list-decimal pl-6">
        <li className="mb-2">
          Login and Access Tool:
          <ul className="list-disc pl-6">
            <li>
              <Link href={PAGES.login} className="text-blue">
                Login{" "}
              </Link>
              to your dashboard and find the tool&apos;s page.
            </li>
          </ul>
        </li>
        <li className="mb-2">
          Create a Profile (if not done already):
          <ul className="list-disc pl-6">
            <li>
              If you don&apos;t have a profile, follow the prompts to create
              one. Provide necessary details such as name, contact information,
              and delivery preferences.
            </li>
          </ul>
        </li>
        <li className="mb-2">
          Monitor Orders and Email Notifications:
          <ul className="list-disc pl-6">
            <li>
              Starting an hour before the meal service begins, regularly check
              your delivery page for new orders.
            </li>
            <li>
              Email notifications will be sent automatically for every new
              order.
            </li>
          </ul>
        </li>
        <li className="mb-2">
          Receive New Order:
          <ul className="list-disc pl-6">
            <li>
              When you receive a new order notification, promptly proceed to the
              room specified for delivery.
            </li>
          </ul>
        </li>
        <li className="mb-2">
          Collect Meal Ticket:
          <ul className="list-disc pl-6">
            <li>
              Upon reaching the specified location, collect the meal ticket
              associated with the order.
            </li>
          </ul>
        </li>
        <li className="mb-2">
          Meal Service Begins:
          <ul className="list-disc pl-6">
            <li>
              Once the meal service begins, head to the cafeteria to pick up the
              ordered meals.
            </li>
          </ul>
        </li>
        <li className="mb-2">
          Deliver to Orderer:
          <ul className="list-disc pl-6">
            <li>
              Deliver the meals to the orderer&apos;s room as specified in the
              order.
            </li>
          </ul>
        </li>
        <li className="mb-2">
          Receive and Confirm Order:
          <ul className="list-disc pl-6">
            <li>
              Once the orderer receives the food, let them know to update the
              status of the order.
            </li>
          </ul>
        </li>
        <li className="mb-2">
          Payout:
          <ul className="list-disc pl-6">
            <li>
              The next day, expect to receive your payout for the previous
              day&apos;s deliveries to the specified account you added when
              creating your profile.
            </li>
          </ul>
        </li>
      </ol>
    </div>
  );
};

export default HowItWorksPageCD;
