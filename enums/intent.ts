export enum ChatIntent {
    GREETING = 'greeting',
    CHECKUP = 'checkup',
    PRIVACY_POLICY_YES = 'privacy_policy_yes',
    PRIVACY_POLICY_NO = 'privacy_policy_no',
    PRIVACY_POLICY = 'privacy_policy',
    LANGUAGE_SET = 'language_set',
    LANGUAGE_CHANGE = 'language_change',
    LANGUAGE_CHANGE_SUCCESS = 'language_change_success',
    HELP = 'help',

    GENERAL = 'general',
    NAME_SET = 'name_set',
    AGE_SET = 'age_set',
    SEX_SET = 'sex_set',

    ELICITATION = 'elicitation',
    INITIAL_SYMPTOM_SET = 'initial_symptom_set',

    HAS_SYMPTOM_YES = 'has_symptom_yes',
    HAS_SYMPTOM_NO = 'has_symptom_no',
    DURATION_GENERIC_SET = 'duration_generic_set',
    DURATION_EXPLICIT_SET = 'duration_explicit_set',
    WEIGHT_SET = 'weight_set',
    TEMPERATURE_BODY_SET = 'temperature_body',
    FREQUENCY_ADVERBS_SET = 'frequency_adverbs_set',
    FREQUENCY_EXPLICIT_SET = 'frequency_explicit_set',
    PAIN_ADJECTIVES_SET = 'pain_adjectives_set',
    PAIN_INTENSITY_SET = 'pain_intensity_set',
    WEAKNESS_INTENSITY_SET = 'weakness_intensity_set',
    LOCATION_EYES = 'location_eyes_set',
    LOCATION_BODY_LOCALE = 'location_body_locale_set',
    LOCATION_BODY_REGION = 'location_body_region_set',
    COLOR_PHLEGM_SET = 'color_phlegm_set',
    DIFFICULTY_SET = 'difficulty_set',
    MOISTURE_SET = 'moisture_set',
    PHYSICAL_STATE_SET = 'physical_state_set',
    COUNT_SET = 'count_set',
    INTERFERENCE_YES = 'inteference_yes',
    INTERFERENCE_NO = 'inteference_no',
    PARTS_DAY_SET = 'parts_day_set',
    HEARTRATE_SET = 'heartrate_set',
    BLOOD_PRESSURE_SET = 'blood_pressure_set',
    TRIGGER_ACTIVITY_SET = 'trigger_activity_set',
    TRIGGER_STATE_SET = 'trigger_state_set',
    TRIGGER_FOOD_SET = 'trigger_food_set',
    CHANGE_QUANTITY_SET = 'change_quantity_set',
    CARDIOVASCULAR_SET = 'cardiovascular_set',
    RESPIRATORY_SET = 'respiratory_set',
    VISIBILITY_SET = 'visibility_set',
    PAINKILLERS_YES = 'pain_killers_yes',
    PAINKILLERS_NO = 'pain_killers_no',
};