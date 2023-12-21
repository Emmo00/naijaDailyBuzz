require('dotenv').config();
import jobQueues from './queue';
import cron from 'node-cron';
import mongoose from 'mongoose';

//
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const express = require('express');
const morgan = require('morgan');

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: jobQueues.queues.map((queue) => new BullAdapter(queue.bull)),
  serverAdapter: serverAdapter,
});

const app = express();

app.use(morgan('combined'));

app.use('/admin/queues', serverAdapter.getRouter());

app.use(function (req, res) {
  res.json({ message: 'worker online' });
});

// other configurations of your server

app.listen(3000, () => {
  console.log('Running on 3000...');
  console.log('For the UI, open http://localhost:3000/admin/queues');
  console.log('Make sure Redis is running on port 6379 by default');
});
//

jobQueues.process();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to Mongodb server from worker💽');
  })
  .catch((err) => {
    console.error('error connecting to Mongodb server', err);
  });

cron.schedule(
  '*/20 * * * *',
  async () => {
    console.log('[info] start getting news data');
    await jobQueues.add('get-news');
    console.log('[info] done getting news', Date.now());
  },
  { name: 'get news every 30 minutes', runOnInit: true }
);

cron.schedule(
  '0 6 * * *',
  async () => {
    console.log('[info] start sending update mails');
    await jobQueues.add('update-mail');
    console.log('[info] done sending update mails', Date.now());
  },
  { name: 'get news every 30 minutes', runOnInit: false }
);
