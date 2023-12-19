require('dotenv').config()
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  // host: process.env.MAIL_HOST,

  // port: process.env.MAIL_PORT,
  // secure: true,
  auth: {
    type: "OAuth2",
    user: "nwaforemmanuel005@gmail.com",
    clientId: process.env.MAIL_CLIENTID,
    clientSecret: process.env.MAIL_CLIENTSECRET,
    refreshToken: process.env.MAIL_REFRESHTOKEN,
    accessToken: process.env.MAIL_ACCESSTOKEN,
  },
});

export default transporter