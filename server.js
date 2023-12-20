require('dotenv').config();

import express from 'express';
import mongoose from 'mongoose';
import routes from './routes/index';
import morgan from 'morgan';

const port = process.env.PORT || 5000;

const app = express();
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to Mongodb server 💽');
  })
  .catch((err) => {
    console.error('error connecting to Mongodb server', err);
  });

app.set('view engine', 'ejs');
app.use(morgan('combined'))
app.use(express.static('./public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.use((req, res) => {
  return res.render('404')
})

app.use((err, req, res) => {
  console.error(err.stack);

  res.status(500).json({
    message: 'Internal server error',
    error:
      process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : err.message,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port} 💻`);
});
