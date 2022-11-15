import nodemailer from "nodemailer"
import axios from "axios"
import dotenv from 'dotenv'
import { TOKEN_RESPONSE } from "../@types/googleType";
import { forgetPass } from "../mocks/tmpGmailContext";
dotenv.config()

const cred = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  refreshToken: process.env.GOOGLE_REF_TOKEN,
}

async function sendMail({ to, subject, context }) {
  try {
    const tokenProviderUrl = 'https://developers.google.com/oauthplayground/refreshAccessToken'
    const data = {
      refresh_token: cred.refreshToken,
      token_uri: "https://oauth2.googleapis.com/token"
    }
    const res = await axios.post<TOKEN_RESPONSE>(tokenProviderUrl, data)

    console.log(res.data);

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        // ข้อมูลการเข้าสู่ระบบ
        type: "OAuth2",
        user: "worknarair6@gmail.com", // email user
        accessToken: res.data.access_token, // email password
        clientId: cred.clientId,
        clientSecret: cred.clientSecret,
        refreshToken: cred.refreshToken,
      },
    });


    let info = await transporter.sendMail({
      from: '"Agri-flow" <worknarair6@gmail.com>',
      to,
      subject,
      html: context,
    });

    // log ข้อมูลการส่งว่าส่งได้-ไม่ได้
    console.log("Message sent: %s", info.messageId);

  } catch (e) {
    console.error(e);
  }
};

const helper = {
  raw: sendMail,
  forgetPass: async (to: string, linkReset: string) => {
    const context = forgetPass(linkReset, to)
    sendMail({ to, subject: "[Agri-Flow] Password Reset", context })
  }
}

export default helper;