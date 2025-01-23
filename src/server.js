import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import bullServerAdapter from './config/bullBoardConfig.js';
import connectDB from './config/dbConfig.js';
import { PORT } from './config/serverConfig.js';
import channelSocketHandlers from './controllers/channelSocketController.js';
import messageSocketHandlers from './controllers/messageSocketController.js';
import apiRouter from './routes/apiRouter.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

app.use(cors());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

server.listen(PORT, async () => {
  console.log('App started on port ', PORT);
  connectDB();
});

io.on('connection', (socket) => {
  messageSocketHandlers(io, socket);
  channelSocketHandlers(io, socket);
});

app.use('/api', apiRouter);
app.use('/ui', bullServerAdapter.getRouter());

app.get('/ping', (req, res) => {
  res.send({ message: 'Pong' });
});
