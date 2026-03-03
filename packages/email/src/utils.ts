import * as React from "react";
import { render } from "@react-email/components";
import sgMail from "@sendgrid/mail";

import { emailEnv } from "../env";

const env = emailEnv();

if (env.SENDGRID_API_KEY) {
  sgMail.setApiKey(env.SENDGRID_API_KEY);
}

export type SendEmailOptions = {
  to: string;
  subject: string;
  react: React.ReactElement;
};

export const sendEmail = async ({ to, subject, react }: SendEmailOptions) => {
  if (!env.SENDGRID_API_KEY) {
    console.warn(
      "SENDGRID_API_KEY is not set. Email styling and content attached below.",
    );
    console.warn("To:", to);
    console.warn("Subject:", subject);
    // return fake success for local dev without key
    return { success: false, message: "SENDGRID_API_KEY is not set." };
  }

  try {
    const html = await render(react);

    const options = {
      from: env.SENDGRID_FROM_EMAIL ?? "noreply@beeto.com",
      to,
      subject,
      html,
    };

    const response = await sgMail.send(options);
    return { success: true, response };
  } catch (error) {
    console.error("Error sending email via SendGrid:", error);
    return { success: false, error };
  }
};
