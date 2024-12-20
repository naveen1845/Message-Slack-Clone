import express from 'express';

import bullServerAdapter from './config/bullBoardConfig.js';
import connectDB from './config/dbConfig.js';
import { PORT } from './config/serverConfig.js';
import apiRouter from './routes/apiRouter.js';

const app = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, async () => {
  console.log('App started on port ', PORT);
  connectDB();
});

app.use('/api', apiRouter);
app.use('/ui', bullServerAdapter.getRouter());

app.get('/ping', (req, res) => {
  res.send({ message: 'Pong' });
});
