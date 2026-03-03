import * as React from "react";

import { sendEmail } from "../utils";
import { AuthEmail } from "./template";

export type SendAuthEmailOptions = {
  to: string;
  url: string;
  otp: string;
  isAlreadySignedIn: boolean;
};

export const sendAuthEmail = async ({
  to,
  url,
  isAlreadySignedIn,
  otp,
}: SendAuthEmailOptions) => {
  let subject = isAlreadySignedIn
    ? "Your Beeto Verification Code"
    : "Welcome to Beeto!";

  return sendEmail({
    to,
    subject,
    react: React.createElement(AuthEmail, { url, otp }),
  });
};
