import express, { Express, Request, Response, Router } from 'express';
import { WebhookClient } from 'dialogflow-fulfillment';
import module_introduction from '@fulfillment/module_introduction';
import module_general from '@fulfillment/module_general_questions';
import module_symptom_elicitation from '@fulfillment/module_symptom_elicitation';
import { ChatIntent } from 'enums/intent';
import { jump_flow, set_context, webhook } from '@fulfillment/webhook';

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

    // Introduction Intents
    handlers.set(ChatIntent.GREETING, module_introduction.greeting);
    handlers.set(ChatIntent.CHECKUP, module_introduction.checkup);
    handlers.set(ChatIntent.PRIVACY_POLICY_YES, module_introduction.privacy_policy_yes);
    handlers.set(ChatIntent.PRIVACY_POLICY_NO, module_introduction.privacy_policy_no);
    handlers.set(ChatIntent.LANGUAGE_SET, module_introduction.language_set);
    handlers.set(ChatIntent.LANGUAGE_CHANGE, module_introduction.language_change);

    // General Questions Intents
    handlers.set(ChatIntent.GENERAL, module_general.general);
    handlers.set(ChatIntent.NAME_SET, module_general.name_set);
    handlers.set(ChatIntent.AGE_SET, module_general.age_set);
    handlers.set(ChatIntent.SEX_SET, module_general.sex_set);

    // Symptom Elicitation Intents
    handlers.set(ChatIntent.ELICITATION, module_symptom_elicitation.elicitation);
    handlers.set(ChatIntent.INITIAL_SYMPTOM_SET, module_symptom_elicitation.initial_symptom_set);

    // Symptom Property Intents
    handlers.set(ChatIntent.HAS_SYMPTOM_YES, module_symptom_elicitation.has_symptom_yes);
    handlers.set(ChatIntent.HAS_SYMPTOM_NO, module_symptom_elicitation.has_symptom_no);
    handlers.set(ChatIntent.INTERFERENCE_YES, module_symptom_elicitation.inteference_yes);
    handlers.set(ChatIntent.INTERFERENCE_NO, module_symptom_elicitation.inteference_no);
    handlers.set(ChatIntent.CHANGE_QUANTITY_SET, module_symptom_elicitation.change_quantity_set);

    handlers.set(ChatIntent.DURATION_GENERIC_SET, module_symptom_elicitation.duration_generic_set);
    handlers.set(ChatIntent.DURATION_EXPLICIT_SET, module_symptom_elicitation.duration_explicit_set);
    handlers.set(ChatIntent.FREQUENCY_ADVERBS_SET, module_symptom_elicitation.frequency_adverbs_set);
    handlers.set(ChatIntent.FREQUENCY_EXPLICIT_SET, module_symptom_elicitation.frequency_explicit_set);
    handlers.set(ChatIntent.PARTS_DAY_SET, module_symptom_elicitation.parts_day_set);

    handlers.set(ChatIntent.WEIGHT_SET, module_symptom_elicitation.weight_set);
    handlers.set(ChatIntent.TEMPERATURE_BODY_SET, module_symptom_elicitation.temperature_body_set);
    handlers.set(ChatIntent.COLOR_PHLEGM_SET, module_symptom_elicitation.color_phlegm_set);
    handlers.set(ChatIntent.BLOOD_PRESSURE_SET, module_symptom_elicitation.blood_pressure_set);
    handlers.set(ChatIntent.HEARTRATE_SET, module_symptom_elicitation.heartrate_set);

    handlers.set(ChatIntent.PAIN_ADJECTIVES_SET, module_symptom_elicitation.pain_adjectives_set);
    handlers.set(ChatIntent.PAIN_INTENSITY_SET, module_symptom_elicitation.pain_intensity_set);
    handlers.set(ChatIntent.WEAKNESS_INTENSITY_SET, module_symptom_elicitation.weakness_intensity_set);

    handlers.set(ChatIntent.LOCATION_EYES, module_symptom_elicitation.location_eyes_set);
    handlers.set(ChatIntent.LOCATION_BODY_LOCALE, module_symptom_elicitation.location_body_locale_set);
    handlers.set(ChatIntent.LOCATION_BODY_REGION, module_symptom_elicitation.location_body_region_set);

    handlers.set(ChatIntent.DIFFICULTY_SET, module_symptom_elicitation.difficulty_set);
    handlers.set(ChatIntent.MOISTURE_SET, module_symptom_elicitation.moisture_set);
    handlers.set(ChatIntent.PHYSICAL_STATE_SET, module_symptom_elicitation.physical_state_set);
    handlers.set(ChatIntent.COUNT_SET, module_symptom_elicitation.count_set);

    handlers.set(ChatIntent.TRIGGER_ACTIVITY_SET, module_symptom_elicitation.trigger_activity_set);
    handlers.set(ChatIntent.TRIGGER_STATE_SET, module_symptom_elicitation.trigger_state_set);
    handlers.set(ChatIntent.TRIGGER_FOOD_SET, module_symptom_elicitation.trigger_food_set);

    handlers.set(ChatIntent.RESPIRATORY_SET, module_symptom_elicitation.respiratory_set);
    handlers.set(ChatIntent.CARDIOVASCULAR_SET, module_symptom_elicitation.cardiovascular_set);

    // Test Intents
    handlers.set('webhook', webhook);
    handlers.set('developer_context', set_context);
    handlers.set('developer_jump', jump_flow);

    try {
        agent.handleRequest(handlers);
    } catch (err) {
        console.log(err);
        agent.add('No handler for this intent :/');
    }
});

export default router;