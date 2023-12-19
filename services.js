require('dotenv').config()
import jobQueues from "./queue";
import cron from 'node-cron';
import mongoose from 'mongoose';


jobQueues.process();


const databaseHost = process.env.MONGODB_HOST || '127.0.0.1';
const database = process.env.MONGODB_DB || 'naija_daily_buzz';

mongoose
  .connect(`mongodb://${databaseHost}/${database}`)
  .then(() => {
    console.log('Connected to Mongodb server from worker💽');
  })
  .catch((err) => {
    console.error('error connecting to Mongodb server', err);
  });

cron.schedule(
  '*/30 * * * *',
  async () => {
    console.log('[info] start getting news data')
    await jobQueues.add('get-news');
    console.log("[info] done getting news", Date.now())
  },
  { name: 'get news every 30 minutes', runOnInit: true }
);

cron.schedule(
  '0 6 * * *',
  async () => {
    console.log('[info] start sending update mails')
    await jobQueues.add('update-mail');
    console.log("[info] done sending update mails", Date.now())
  },
  { name: 'get news every 30 minutes', runOnInit: false }
);
