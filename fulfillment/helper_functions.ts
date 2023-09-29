function getUserFacebookID(agent: any) {
    return agent.session.split()[4] ?? 'dialogflow';
};

export { getUserFacebookID }