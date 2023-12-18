import jobQueues from "./queue";
import cron from 'node-cron';


jobQueues.process();

cron.schedule(
  '*/30 * * * *',
  () => {
    console.log('goo')
    jobQueues.add('get-news');
  },
  { name: 'get news every 30 minutes', runOnInit: true }
);
