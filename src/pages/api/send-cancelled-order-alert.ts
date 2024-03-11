import CancelledOrderAlert from "@/components/email-templates/CancelledOrderAlert";
import { db } from "@/services/firebase";
import { Deliverer, Order, User } from "@/types/dashboard";
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { order_id } = req.query;

  try {
    const order = (
      await getDoc(doc(db, "orders", order_id as string))
    ).data() as Order;

    const deliverer = (
      await getDoc(doc(db, "deliverers", order.deliverer_id))
    ).data() as Deliverer;

    const orderer = (
      await getDoc(doc(db, "users", order.orderer_id))
    ).data() as User;

    const orderer_res = await resend.emails.send({
      from: "Babcock Tools <hello@babcock.tools>",
      to: [orderer.email],
      subject: "Cancelled order alert",
      react: CancelledOrderAlert({
        email: orderer.email,
        details: {
          meal_type: order.meal_type,
          ticket_date: new Date(order.ticket_date).toDateString(),
          amount: (
            parseInt(order.amount_paid.amount) +
            parseInt(order.amount_paid.charges)
          ).toString(),
          date_ordered: new Date(order.date_ordered).toDateString(),
          deliverers_name: deliverer.full_name,
          orderers_name: orderer.full_name,
          room_number: order.room_number,
        },
        to_orderer: true,
      }),
    });

    const deliverer_res = await resend.emails.send({
      from: "Babcock Tools <hello@babcock.tools>",
      to: [deliverer.email],
      subject: "Cancelled order alert",
      react: CancelledOrderAlert({
        email: deliverer.email,
        details: {
          meal_type: order.meal_type,
          ticket_date: new Date(order.ticket_date).toDateString(),
          amount: (
            parseInt(order.amount_paid.amount) +
            parseInt(order.amount_paid.charges)
          ).toString(),
          date_ordered: new Date(order.date_ordered).toDateString(),
          deliverers_name: deliverer.full_name,
          orderers_name: orderer.full_name,
          room_number: order.room_number,
        },
        to_orderer: false,
      }),
    });

    res.status(200).json({ orderer_res, deliverer_res });
  } catch (error) {
    res.status(500).json(error);
  }
};
