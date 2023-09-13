import express, { Express, Request, Response, Router } from 'express';

const router: Router = express.Router();

router.get('/webhook/df', (req: Request, res: Response) => {
    res.send('Dialogflow G123');
});

// * Captures fulfillment reqeuests sent through Dialogflow
router.post('/webhook/df', (req: Request, res: Response) => {
    res.send('Dialogflow P123');
});

export default router;