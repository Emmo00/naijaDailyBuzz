import cron from 'node-cron';
import Queue from 'bull';
import * as jobs from './jobs';

console.log('hi')
const queues = Object.values(jobs).map((job) => ({
  bull: new Queue(job.name),
  name: job.name,
  handle: job.handle,
  options: job.options,
}));

const jobQueues = {
  queues,
  add(name, data) {
    const queue = this.queues.find((queue) => queue.name === name);
    return queue?.bull.add(data, queue.options);
  },
  process() {
    return this.queues.forEach((queue) => {
      queue.bull.process(queue.handle);
      queue.bull.on('failed', (job, err) => {
        console.error('job failed', queue.name, job.data);
        console.error(err);
      });
    });
  },
};

jobQueues.process();

cron.schedule(
  '*/30 * * * *',
  () => {
    console.log('goo')
    jobQueues.add('get-news');
  },
  { name: 'get news every 30 minutes', runOnInit: true }
);

export { jobQueues };
