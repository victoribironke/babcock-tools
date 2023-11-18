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

interface MealTicketDetailsProps {
  email: string;
  details: {
    hall_of_residence: string;
    phone: string;
    meal_type: string;
    ticket_date: string;
    price: string;
    full_name: string;
    matric_no: string;
  };
}

export const MealTicketDetails = ({
  email,
  details,
}: MealTicketDetailsProps) => {
  return (
    <Html>
      <Head />
      <Preview>Meal ticket details</Preview>
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
                  Here are the details for the ticket you requested
                </Heading>

                <Text style={paragraph}>
                  <b>Owner&apos;s name: </b>
                  {details.full_name}
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>Owner&apos;s matric no: </b>
                  {details.matric_no}
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>Owner&apos;s phone number: </b>
                  {details.phone}
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>Owner&apos;s hostel: </b>
                  {details.hall_of_residence}
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>Meal type: </b>
                  {details.meal_type}
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>Valid date: </b>
                  {details.ticket_date}
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>Ticket&apos;s price: </b>₦{details.price}
                </Text>

                <Text style={paragraph}>
                  You can use the above info to find the owner and buy the
                  ticket.
                </Text>
                <Text style={{ ...paragraph, marginTop: -5 }}>
                  Thank you for using this tool. If you want to suggest a tool
                  or give feedback or request help, please reply to this email.
                </Text>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default MealTicketDetails;

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
