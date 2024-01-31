import WelcomeEmail from "@/components/email-templates/WelcomeMessage";
import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, first_name } = req.query;

  try {
    const data = await resend.emails.send({
      from: "Babcock Tools <hello@babcock.tools>",
      to: [email as string],
      subject: "Welcome",
      react: WelcomeEmail({
        first_name: first_name as string,
      }),
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};
