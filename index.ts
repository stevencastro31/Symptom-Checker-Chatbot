import express, { Express, Request, Response } from 'express';
import messenger from './routes/webhooks/messenger';
import dialogflow from './routes/webhooks/dialogflow';

import dotenv from 'dotenv';
dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// Routes & Middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use([dialogflow, messenger]);

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});