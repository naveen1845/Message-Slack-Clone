import express from 'express';

import connectDB from './config/dbConfig.js';
import { PORT } from './config/serverConfig.js';
import apiRouter from './routes/apiRouter.js'

const app = express();

app.listen(PORT, () => {
    console.log('App started on port ', PORT);
    connectDB();
})

app.use('/api', apiRouter)

app.get('/ping', (req, res) => {
    res.send({message: 'Pong'});
})
