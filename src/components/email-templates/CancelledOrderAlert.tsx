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
  Text,
} from "@react-email/components";
import * as React from "react";

interface CancelledOrderAlertProps {
  email: string;
  details: {
    meal_type: string;
    deliverers_name: string;
    orderers_name: string;
    ticket_date: string;
    date_ordered: string;
    room_number: string;
    amount: string;
  };
  to_orderer: boolean;
}

export const CancelledOrderAlert = ({
  email,
  details,
  to_orderer,
}: CancelledOrderAlertProps) => {
  return (
    <Html>
      <Head />
      <Preview>Cancelled order alert</Preview>
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
                  {to_orderer
                    ? "An order has been cancelled"
                    : "You just cancelled an order"}
                </Heading>

                <Text style={paragraph}>
                  <b>Meal type: </b>
                  {details.meal_type}
                </Text>
                {to_orderer && (
                  <Text style={{ ...paragraph, marginTop: -5 }}>
                    <b>Deliverer&apos;s name: </b>
                    {details.deliverers_name}
                  </Text>
                )}
                {!to_orderer && (
                  <Text style={{ ...paragraph, marginTop: -5 }}>
                    <b>Orderer&apos;s name: </b>
                    {details.orderers_name}
                  </Text>
                )}
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>Ticket&apos;s date: </b>
                  {details.ticket_date}
                </Text>
                {to_orderer && (
                  <Text style={{ ...paragraph, marginTop: -5 }}>
                    <b>Date ordered: </b>
                    {details.date_ordered}
                  </Text>
                )}
                {!to_orderer && (
                  <Text style={{ ...paragraph, marginTop: -5 }}>
                    <b>Room number: </b>
                    {details.room_number}
                  </Text>
                )}

                <Text style={paragraph}>
                  A refund of ₦{details.amount} has been queued and will soon be
                  processed to {to_orderer ? "you" : "the orderer"}.
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

export default CancelledOrderAlert;

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
