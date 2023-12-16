import transporter from '../config/mail';
import { generateUnsubscribeToken, generateWelcomeToken } from '../utils/token';
import ejs from 'ejs';
import fs from 'fs';

const welcomeMailTemplate = fs
  .readFileSync('./views/welcomeMail.ejs')
  .toString('utf-8');

export default {
  name: 'welcome-mail',
  async handle({ data }) {
    return console.log('welcome-mail, ', data);
    const token = generateWelcomeToken(data._id);
    transporter.sendMail({
      from: process.env.MAIL_UPDATE_EMAIL,
      to: data.email,
      subject: 'Welcome to NaijaDailyBuzz newsletter',
      html: ejs.render(welcomeMailTemplate, { token }),
      list: {
        help: process.env.MAIL_HELP_MAIL,
        unsubscribe: `${
          process.env.DOMAIN_NAME_URL
        }/unsubscribe?token=${generateUnsubscribeToken(data.id)}`,
        subscribe: process.env.DOMAIN_NAME_URL,
      },
    });
    console.log('welcome mail sent to ', data.email);
  },
  options: { lifo: true, priority: 1 },
};
