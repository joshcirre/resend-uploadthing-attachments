import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

export const KittyEmail = ({ customMessage }: { customMessage?: string }) => (
  <Html>
    <Head />
    <Preview>A friend thought you might need some love.</Preview>
    <Body style={main}>
      <Container
        style={{
          ...container,
          textAlign: "center" as
            | "left"
            | "right"
            | "center"
            | "justify"
            | "initial"
            | "inherit",
        }}
      >
        <Heading style={h1}>Kitty Korner</Heading>
        <Text style={text}>
          So we heard you like cats. Here&apos;s some cats from a friend of
          yours who just wants to cheer you up.
        </Text>
        {customMessage && (
          <Container style={quoteBox}>
            <Text style={text}>{customMessage}</Text>
          </Container>
        )}
      </Container>
    </Body>
  </Html>
);

export default KittyEmail;

const main = {
  backgroundColor: "transparent",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  colorScheme: "light dark",
};

const container = {
  margin: "auto",
  padding: "96px 20px 64px",
  textAlign: "center",
};

const h1 = {
  color: "currentColor",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "40px",
  margin: "0 0 20px",
};

const text = {
  color: "currentColor",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0 0 40px",
};

const quoteBox = {
  border: "1px solid #ddd",
  padding: "10px",
  margin: "20px 0",
  borderRadius: "5px",
  backgroundColor: "#f9f9f9",
};
