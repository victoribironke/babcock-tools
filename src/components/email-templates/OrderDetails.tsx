import { parseDate } from "@/utils/helpers";
import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Link,
  Text,
} from "@react-email/components";
import * as React from "react";

interface OrderDetailsProps {
  email: string;
  details: {
    meal_type: string;
    ticket_date: string;
    room_number: string;
    full_name: string;
  };
}

export const OrderDetails = ({ email, details }: OrderDetailsProps) => {
  return (
    <Html>
      <Head />
      <Preview>Order details</Preview>
      <Body style={main}>
        <Container>
          <Section style={content}>
            <Row style={{ ...boxInfos, paddingBottom: "0" }}>
              <Column>
                <Heading
                  style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Hi {email.split("@")[0]},
                </Heading>
                <Heading
                  as="h2"
                  style={{
                    fontSize: 26,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Here are the details for a new order you received
                </Heading>

                <Text style={paragraph}>
                  <b>Orderer&apos;s name: </b>
                  {details.full_name}
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>Orderer&apos;s room number: </b>
                  {details.room_number}
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>Meal type: </b>
                  {details.meal_type}
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>Ticket&apos;s date: </b>
                  {parseDate(details.ticket_date) as string}
                </Text>

                <Text style={paragraph}>
                  You can use the above info to find the orderer in your hostel
                  and get their ticket.
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  You can find the full list of orders in your{" "}
                  <Link
                    href="https://www.babcock.tools/dashboard/cafeteria-delivery/deliverer-profile"
                    style={{ color: "blue" }}
                  >
                    deliverer&apos;s profile.
                  </Link>
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  Thank you for using this tool. If you want to suggest a tool
                  or give feedback or request help, please reply to
                  babcock.tools@gmail.com.
                </Text>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderDetails;

const main = {
  backgroundColor: "#fff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const paragraph = {
  fontSize: 16,
};

const content = {
  border: "1px solid rgb(0,0,0, 0.1)",
  borderRadius: "3px",
  overflow: "hidden",
};

const boxInfos = {
  padding: "20px 40px",
};
