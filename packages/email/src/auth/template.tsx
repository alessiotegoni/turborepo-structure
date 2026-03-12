import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface AuthEmailProps {
  url: string;
  otp: string;
}

export const AuthEmail = ({ url: _url, otp }: AuthEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Access your Beeto account</Preview>
      <Tailwind>
        <Body className="bg-[#f6f9fc] font-sans">
          <Container className="mx-auto mb-16 max-w-[580px] rounded-md bg-white py-5 pb-12 shadow-sm">
            <Heading className="my-[30px] text-center text-2xl font-bold text-[#333]">
              Beeto Authentication
            </Heading>

            <Section className="px-12">
              <Text className="text-base leading-6 text-[#333]">
                Here is your one-time code to access your Beeto account:
              </Text>
              <Section className="my-4 rounded bg-black/5 p-4">
                <Text className="m-0 text-center text-[32px] font-bold tracking-[8px]">
                  {otp}
                </Text>
              </Section>
              <Text className="text-base leading-6 text-[#333]">
                You can also click the link below to sign in directly:
              </Text>

              {/* <Section className="mt-8 mb-8 text-center">
                <Link
                  href={url}
                  className="inline-block rounded bg-[#007ee6] px-6 py-3 text-center text-base text-white no-underline"
                >
                  Sign In to Beeto
                </Link>
              </Section> */}

              <Text className="mt-12 text-sm text-[#898989]">
                If you didn't request this email, you can safely ignore it.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AuthEmail;
