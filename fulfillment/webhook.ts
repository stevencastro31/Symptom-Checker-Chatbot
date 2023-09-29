async function webhook(agent: any) {
    console.log(agent.parameters);
    console.log(agent.action);
    // console.log(agent);

    if (agent.parameters.color === '') {
        agent.add('What color?');
        return;
    }
    if (agent.parameters.number === '') {
        agent.add('How old are you?');  
        return;
    }
    agent.add(`Nice, your number is ${agent.parameters.number} and your color is ${agent.parameters.color}: ${agent.action}`);
};

export { webhook }