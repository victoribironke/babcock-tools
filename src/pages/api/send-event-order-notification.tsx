import EventOrderNotification from "@/components/email-templates/EventOrderNotification";
import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, first_name, password, date_time, ticket_code, event_name } =
    req.query;

  if ((password as string) !== process.env.NEXT_PUBLIC_API_PASSWORD) {
    res.status(401).json({ error: "Wrong password or no password found" });
    return;
  }

  try {
    const data = await resend.emails.send({
      from: "Babcock Tools <hello@babcock.tools>",
      to: [email as string],
      subject: "Event notification",
      react: EventOrderNotification({
        first_name: first_name as string,
        email: email as string,
        date_time: date_time as string,
        event_name: event_name as string,
        ticket_code: ticket_code as string,
      }),
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};
