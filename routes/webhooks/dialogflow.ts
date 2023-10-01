import express, { Express, Request, Response, Router } from 'express';
import { WebhookClient } from 'dialogflow-fulfillment';
import module_introduction from '@fulfillment/module_introduction';
import module_general from '@fulfillment/module_general_questions';
import { ChatIntent } from 'enums/intent';

const router: Router = express.Router();

router.get('/webhook/df', (req: Request, res: Response) => {
    res.send('GET Dialogflow');
});

// * Captures fulfillment webhook requests sent through Dialogflow
router.post('/webhook/df', (req: Request, res: Response) => {
    // Instantiate Agent
    const agent: WebhookClient = new WebhookClient({request: req, response: res});

    // Handlers
    console.log(`Handling Intent: ${req.body.queryResult.intent.displayName}`);
    const handlers = new Map();

    handlers.set(ChatIntent.GREETING, module_introduction.greeting);
    handlers.set(ChatIntent.CHECKUP, module_introduction.checkup);
    handlers.set(ChatIntent.PRIVACY_POLICY_YES, module_introduction.privacy_policy_yes);
    handlers.set(ChatIntent.PRIVACY_POLICY_NO, module_introduction.privacy_policy_no);
    handlers.set(ChatIntent.LANGUAGE_SET, module_introduction.language_set);
    handlers.set(ChatIntent.LANGUAGE_CHANGE, module_introduction.language_change);

    handlers.set(ChatIntent.GENERAL, module_general.general);
    handlers.set(ChatIntent.NAME_SET, module_general.name_set);
    handlers.set(ChatIntent.AGE_SET, module_general.age_set);
    handlers.set(ChatIntent.SEX_SET, module_general.sex_set);

    try {
        agent.handleRequest(handlers);
    } catch (err) {
        console.log(err);
        agent.add('No handler for this intent :/');
    }
});

export default router;