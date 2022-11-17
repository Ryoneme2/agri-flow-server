import nodemailer from "nodemailer"
import axios from "axios"
import dotenv from 'dotenv'
import { TokenResponse } from "@type/googleType";
import { forgetPass } from "@mock/tmpGmailContext";
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
    const res = await axios.post<TokenResponse>(tokenProviderUrl, data)

    console.log(res.data);

    const transporter = nodemailer.createTransport({
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
        expires: 1000 * 60 * 60 * 24 * 30
      },
    });

    const info = await transporter.sendMail({
      from: '"Agri-flow" <worknarair6@gmail.com>',
      to,
      subject,
      html: context,
    });

    return {
      success: true,
      msg: info.messageId
    }

  } catch (e) {
    console.error(e);
    return {
      success: true,
      msg: ''
    }
  }
};

const helper = {
  raw: sendMail,
  forgetPass: async (to: string, linkReset: string) => {
    const context = forgetPass(linkReset, to)
    return sendMail({ to, subject: "[Agri-Flow] Password Reset", context })
  }
}

export default helper;