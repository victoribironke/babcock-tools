import MealTicketDetails from "@/components/email-templates/MealTicketDetails";
import OrderDetails from "@/components/email-templates/OrderDetails";
import { db } from "@/services/firebase";
import { Order } from "@/types/dashboard";
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, order_id, full_name } = req.query;

  try {
    const order: Order = (
      await getDoc(doc(db, "orders", order_id as string))
    ).data() as Order;

    const data = await resend.emails.send({
      from: "Babcock Tools <hello@babcock.tools>",
      to: [email as string],
      subject: "New order for delivery",
      react: OrderDetails({
        email: email as string,
        details: {
          full_name: full_name as string,
          meal_type: order.meal_type,
          room_number: order.room_number,
          ticket_date: order.ticket_date,
        },
      }),
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};
