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
    console.log('[info] welcome-mail, ', data);
    const token = generateWelcomeToken(data.subscriber._id);
    transporter.sendMail(
      {
        from: process.env.MAIL_UPDATE_EMAIL,
        to: data.subscriber.email,
        subject: 'Welcome to NaijaDailyBuzz newsletter',
        html: ejs.render(welcomeMailTemplate, { token }),
        list: {
          help: process.env.MAIL_HELP_EMAIL,
          unsubscribe: `${
            process.env.DOMAIN_NAME_URL
          }/unsubscribe?token=${generateUnsubscribeToken(data.subscriber._id)}`,
          subscribe: process.env.DOMAIN_NAME_URL,
        },
      },
      function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Welcome Email sent: ' + info.response);
          // do something useful
        }
      }
    );
  },
  options: { lifo: true, priority: 1 },
};
