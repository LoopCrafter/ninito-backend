import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplates.js";
import { mailTrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];
  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your Email!",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email verification",
    });

    console.log("Email Send successfully", response);
  } catch (error) {
    console.log(error);
    throw new Error(`Error sending verificationCode: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, username, appUrl) => {
  const recipient = [{ email }];
  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: "Welcome to Our App! 🎉",
      html: WELCOME_EMAIL_TEMPLATE.replace("{username}", username).replace(
        "{appUrl}",
        appUrl
      ),
      category: "Welcome email",
    });

    console.log("Welcome Email sent successfully", response);
  } catch (error) {
    console.log(error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sentPasswordResetEmail = async (email, resetUrl) => {
  const recipient = [{ email }];
  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset Your Password!",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
      category: "Password Reset",
    });

    console.log("Email Send successfully", response);
  } catch (error) {
    console.log(error);
    throw new Error(`Error sending verificationCode: ${error}`);
  }
};
export const SendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];
  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });

    console.log("success reset Email Send successfully", response);
  } catch (error) {
    console.log(error);
    throw new Error(`Error sending verificationCode: ${error}`);
  }
};
