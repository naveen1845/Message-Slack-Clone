import express from 'express';

import connectDB from './config/dbConfig.js';
import { PORT } from './config/serverConfig.js';

const app = express();

app.listen(PORT, () => {
    console.log('App started on port ', PORT);
    connectDB();
})

app.get('/ping', (req, res) => {
    res.send({message: 'Pong'});
})



