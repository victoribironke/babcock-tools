import { PAGES } from "@/constants/pages";
import { separateDateTime } from "@/utils/helpers";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Text,
  Link,
} from "@react-email/components";
import * as React from "react";

interface EventOrderNotificationProps {
  first_name: string;
  event_name: string;
  ticket_code: string;
  date_time: string;
  email: string;
  support_email: string;
}

export const EventOrderNotification = ({
  first_name,
  event_name,
  ticket_code,
  email,
  date_time,
  support_email,
}: EventOrderNotificationProps) => {
  const { date, time } = separateDateTime(date_time);

  return (
    <Html>
      <Head />
      <Preview>Here is your ticket, {first_name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={paragraph}>Hi {first_name},</Text>
          <Text style={paragraph}>
            Here is your ticket for <b>{event_name}</b>
          </Text>

          <Text style={paragraph}>
            Ticket code: <b>{ticket_code}</b>
          </Text>

          <Text style={paragraph}>
            Event date: <b>{date}</b>
          </Text>

          <Text style={paragraph}>
            Event time: <b>{time}</b>
          </Text>

          <Hr />

          <Text>
            If you have any questions about this event, send an email to{" "}
            {support_email}.
          </Text>

          <Hr />

          <Text>
            This event was created on{" "}
            <Link href={PAGES.base_url} style={{ color: "blue" }}>
              babcock.tools
            </Link>{" "}
            and this email was sent to {email}.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default EventOrderNotification;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};
