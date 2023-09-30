function getUserFacebookID(agent: any) {
    return agent.session.split()[4] ?? 'dialogflow';
};

function getSession(agent: any) {
    const session = agent.context.get('session');
    if (!session) {
        agent.context.set({name: 'SESSION', lifespan: 99, parameters: {}});
        return {};
    } else {
        return session.parameters;
    }
};

function triggerEvent(agent: any, event: string) {
    agent.add('.');
    agent.setFollowupEvent(event);
};

export { getUserFacebookID, getSession, triggerEvent }