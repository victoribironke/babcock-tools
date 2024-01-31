import {
  Body,
  Button,
  Container,
  Head,
  //   Hr,
  Html,
  //   Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  first_name: string;
}

export const WelcomeEmail = ({ first_name }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome, {first_name}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* <Img
          src="https://babcock.tools/images/logo.jpeg"
          width="128"
          height="140"
          alt="Logo"
          style={logo}
        /> */}
        <Text style={paragraph}>Hi {first_name},</Text>
        <Text style={paragraph}>
          I&apos;m Victor, the maker of Babcock Tools. Thank you for registering
          as a deliverer on the website. I just wanted to let you know that
          I&apos;m here anytime you have questions or need help with any issue
          you may have while using the website.
        </Text>
        <Section style={btnContainer}>
          <Button
            style={button}
            href="https://api.whatsapp.com/send?phone=2347085945833"
          >
            Send me a message on WhatsApp
          </Button>
        </Section>
        <Text style={paragraph}>
          Best,
          <br />
          Victor
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

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

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#128c7e",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};
