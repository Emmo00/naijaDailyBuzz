import transporter from '../config/mail';
import { generateUnsubscribeToken } from '../utils/token';
import Subscriber from '../models/subscriber';
import Article from '../models/article';
import ejs from 'ejs';
import fs from 'fs';

const updateMailTemplate = fs
  .readFileSync('./views/updateMail.ejs')
  .toString('utf-8');

export default {
  name: 'update-mail',
  async handle() {
    console.log('update-mail, ');
    const todayArticles = await Article.find()
      .sort({ pubDate: 'desc' })
      .limit(9);
    const verifiedSubscribers = await Subscriber.find({ verified: true });
    for (const subscriber of verifiedSubscribers) {
      transporter.sendMail({
        from: process.env.MAIL_UPDATE_EMAIL,
        to: subscriber.email,
        subject: 'NaijaDailyBuzz Daily news',
        html: ejs.render(updateMailTemplate, { token, todayArticles }),
        list: {
          help: process.env.MAIL_HELP_MAIL,
          unsubscribe: `${
            process.env.DOMAIN_NAME_URL
          }/unsubscribe?token=${generateUnsubscribeToken(subscriber.id)}`,
          subscribe: process.env.DOMAIN_NAME_URL,
        },
      });
    }
    console.log('welcome mail sent to ', data.email);
  },
};
