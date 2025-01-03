import nodemailer from "nodemailer";
import { google } from "googleapis";
import env from "dotenv";
env.config();
import ejs from "ejs";
import path from "node:path";

const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
const GOOGLE_URL = process.env.GOOGLE_URL as string;
const GOOGLE_TOKEN = process.env.GOOGLE_TOKEN as string;

const oAuth = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_URL);
oAuth.setCredentials({ refresh_token: GOOGLE_TOKEN });

export const friendRequestEmail = async (
  senderEmail: any,
  receiverEmail: any
) => {
  const accessToken: any = (await oAuth.getAccessToken()).token;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GOOGLE_MAIL,
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      refreshToken: GOOGLE_TOKEN,
      accessToken: accessToken,
    },
  });

  const pathFile = path.join(__dirname, "../views/sent.ejs");
  let url = `http://localhost:5173/auth/login`;
  const html = await ejs.renderFile(pathFile, {
    email: senderEmail,
    name: receiverEmail,
    url: url,
  });

  const mailData = {
    to: receiverEmail,
    from: `${process.env.GOOGLE_MAIL}`,
    subject: "",
    text: "This is just a test message",
    html,
  };

  await transporter.sendMail(mailData).then(() => {
    console.log("mail sent");
  });
};
