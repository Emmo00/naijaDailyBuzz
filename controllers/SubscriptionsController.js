import Subscriber from '../models/subscriber';
import jobQueues from '../queue';
import { decodeToken } from '../utils/token';

export default class SubscriptionsController {
  async postNew(req, res) {
    const { email } = req.body;
    console.log(email);

    if (!email)
      return res
        .status(400)
        .render('error', { error: 'Bad request', message: 'Email required' });

    const subscriber = await Subscriber.findOne({ email });
    if (subscriber)
      return res.status(400).render('error', {
        error: 'Bad request',
        message: 'Email already subscribed',
      });

    const newSubscriber = await Subscriber.create({ email });
    await newSubscriber.save();

    jobQueues.add('welcome-mail', { subscriber: newSubscriber });

    return res.status(201).render('info', { message: 'Check you mail' });
  }

  async deleteOne(req, res) {
    const token = req.query.token;
    if (!token)
      return res
        .status(401)
        .render('error', { error: 'Unauthorized', message: 'Token missing' });

    const payload = decodeToken(token, secret);
    if (!payload)
      return res
        .status(400)
        .render('error', { error: 'Unauthorized', message: 'Invalid token' });
    const subscriberId = payload.subscriberId;
    await Subscriber.findByIdAndDelete(subscriberId);
    return res
      .status(200)
      .render('info', { message: 'Successfully unsubscribed' });
  }

  async postVerify(req, res) {
    const token = req.query.token;
    if (!token)
      return res
        .status(401)
        .render('error', { error: 'Unauthorized', message: 'Token missing' });

    const payload = decodeToken(token, secret);
    if (!payload)
      return res
        .status(401)
        .render('error', { error: 'Unauthorized', message: 'Invalid token' });
    const subscriberId = payload.subscriberId;
    const subscriber = await Subscriber.findById(subscriberId);
    if (!subscriber)
      return res.status(404).render('error', {
        error: 'Not found',
        message: 'User not subscribed',
      });
    await Subscriber.updateOne({ _id: subscriberId }, { verified: true });
    return res.status(200).render('info', { message: 'User verified' });
  }
}
