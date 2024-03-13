import MealTicketDetails from "@/components/email-templates/MealTicketDetails";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, ticket_id, password } = req.query;

  if ((password as string) !== process.env.NEXT_PUBLIC_API_PASSWORD) {
    res.status(401).json({ error: "Wrong password or no password found" });
    return;
  }

  try {
    const ticket_data = (
      await getDoc(doc(db, "meal-tickets", ticket_id as string))
    ).data();

    const user_data = (
      await getDoc(doc(db, "users", ticket_data?.uid as string))
    ).data();

    const data = await resend.emails.send({
      from: "Babcock Tools <hello@babcock.tools>",
      to: [email as string],
      subject: "Meal ticket details",
      react: MealTicketDetails({
        email: email as string,
        details: {
          full_name: user_data?.full_name,
          hall_of_residence: user_data?.hall_of_residence,
          matric_no: user_data?.matric_no,
          meal_type: ticket_data?.meal_type,
          phone: user_data?.phone_number,
          price: ticket_data?.price,
          ticket_date: new Date(ticket_data?.ticket_date).toDateString(),
        },
      }),
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};
