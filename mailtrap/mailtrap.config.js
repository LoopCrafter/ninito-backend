import { MailtrapClient } from "mailtrap";
const TOKEN = process.env.MAILTRAP_API_KEY;

export const mailTrapClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@hamed.cloud",
  name: "MERN AUTH",
};
