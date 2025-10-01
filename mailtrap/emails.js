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
      subject: "تأیید ایمیل شما ✔️",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email verification",
    });
  } catch (error) {
    throw new Error(`خطا در ارسال کد تأیید: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, username, appUrl) => {
  const recipient = [{ email }];
  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: "به نینیتو خوش آمدی 🎉",
      html: WELCOME_EMAIL_TEMPLATE.replace("{username}", username).replace(
        "{appUrl}",
        appUrl
      ),
      category: "Welcome email",
    });
  } catch (error) {
    throw new Error(`خطا در ارسال ایمیل خوشامدگویی: ${error}`);
  }
};

export const sentPasswordResetEmail = async (email, resetUrl) => {
  const recipient = [{ email }];
  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: "بازیابی رمز عبور 🔑",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
      category: "Password Reset",
    });
    console.log("++++", response);
  } catch (error) {
    throw new Error(`خطا در ارسال ایمیل بازیابی رمز عبور: ${error}`);
  }
};

export const SendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];
  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: "رمز عبور با موفقیت تغییر کرد ✅",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });
  } catch (error) {
    throw new Error(`خطا در ارسال ایمیل تغییر رمز عبور: ${error}`);
  }
};
