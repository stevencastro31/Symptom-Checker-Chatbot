import express, { Express, Request, Response, Router } from 'express';
import { WebhookClient } from 'dialogflow-fulfillment';
import { webhook } from '@fulfillment/webhook';

const router: Router = express.Router();

router.get('/webhook/df', (req: Request, res: Response) => {
    res.send('GET Dialogflow');
});

// * Captures fulfillment webhook requests sent through Dialogflow
router.post('/webhook/df', (req: Request, res: Response) => {
    // Instantiate Agent
    const agent: WebhookClient = new WebhookClient({request: req, response: res});

    // Handlers
    const handlers = new Map();
    handlers.set('WEBHOOK', webhook);
    agent.handleRequest(handlers);
});

export default router;