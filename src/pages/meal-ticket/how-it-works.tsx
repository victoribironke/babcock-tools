import HeadTemplate from "@/components/general/HeadTemplate";
import { PAGES } from "@/constants/pages";
import { classNames } from "@/utils/helpers";
import Link from "next/link";

const HowItWorksPage = () => {
  const link_cls = "text-blue";
  const text_cls = "w-full text-lg sm:text-xl mb-2";

  return (
    <>
      <HeadTemplate title="How does the meal ticket tool work?" />

      <section className="w-full max-w-3xl px-4 sm:px-8 py-12">
        <h1 className="text-blue text-3xl sm:text-4xl w-full text-center mb-6 font-semibold">
          How to buy a ticket
        </h1>

        <h1 className={text_cls}>
          To buy a ticket, navigate to{" "}
          <Link href={PAGES.meal_ticket} className={link_cls}>
            the tool&apos;s page
          </Link>
          .
        </h1>

        <h1 className={text_cls}>
          Browse the directory to find a ticket, ideally one where the
          owner&apos;s hostel is the same as yours (not necessary).
        </h1>

        <h1 className={text_cls}>
          When you&apos;ve selected your ticket, click &quot;Get owner&apos;s
          details&quot; which would open a modal for you to put in your email.
          Just input your email, click &quot;Get owner&apos;s details&quot; and
          the details would be sent to the email address.
        </h1>

        {/* <h1 className={text_cls}>
          When you&apos;ve selected your ticket, click &quot;Get owner&apos;s
          details&quot; which would open a modal for you to put in your email
          and pay the platform fee (₦100).
        </h1> */}

        {/* <h1 className={text_cls}>
          After payment, the owner&apos;s details is sent to the email you
          provided which you can then use to find the owner to pay for and
          collect the ticket.
        </h1> */}

        <h1 className="text-blue text-3xl sm:text-4xl w-full text-center my-6 font-semibold">
          How to sell a ticket
        </h1>

        <h1 className={text_cls}>
          To sell a ticket,{" "}
          <Link href={PAGES.login} className={link_cls}>
            login
          </Link>{" "}
          or{" "}
          <Link href={PAGES.signup} className={link_cls}>
            create an account
          </Link>
          .
        </h1>

        <h1 className={text_cls}>
          Navigate to{" "}
          <Link href={PAGES.sell_your_meal_ticket} className={link_cls}>
            the tool&apos;s page
          </Link>{" "}
          on your dashboard.
        </h1>

        <h1 className={text_cls}>
          Click &quot;Sell a ticket&quot;, fill in the details of the ticket and
          click &quot;Save&quot;.
        </h1>

        <h1 className={text_cls}>
          The ticket will be added to the public directory. Refresh the page to
          see the ticket on your dashboard.
        </h1>

        <h1 className={text_cls}>
          After the ticket is bought by someone, mark the ticket as sold so it
          will be removed from the public directory. You can also unmark it as
          sold.
        </h1>

        <h1 className={text_cls}>
          You currently cannot edit a ticket so if you put in the wrong details,
          you&apos;ll have to delete it and add it again with the correct
          details.
        </h1>

        <h1 className={classNames(text_cls, "mt-10")}>
          Note: Tickets that have expired would be removed from the public
          directory whether it has been sold or not.
        </h1>

        <h1 className={classNames(text_cls, "mt-10")}>
          Note: It is possible for more than two people to request a ticket, so
          if a ticket is already sold when you meet the owner, you can request a
          refund from us by sending an email to{" "}
          <Link href={PAGES.mailto} className={link_cls}>
            hello@babcock.tools
          </Link>
          .
        </h1>
      </section>
    </>
  );
};

export default HowItWorksPage;
