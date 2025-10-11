export function createEventBus() {
    const subscriptions = { }; // or const subscriptions = { } ?? or subscriptions = { }
    let subscriptionId = 0;

    function subscribe(eventName, listener) {
        if (!(eventName in subscriptions)) {
            subscriptions[eventName] = { };
        }
        subscriptions[eventName][subscriptionId] = listener;
        subscriptionId++;
    }

    function unsubscribe(eventName, id) {
        if (!(eventName in subscriptions)) {
            return
        }
        if (!(id in subscriptions[eventName])) {
            return 
        }
        subscriptions[eventName].delete(id);
        if (subscriptions[eventName].length == 0) {
            subscriptions.delete(eventName);
        }
    }

    function publish(eventName, eventArgs) {
        if (!(eventName in subscriptions)) {
            return
        }
        const listeners = subscriptions[eventName];
        for (const id in listeners) {
            listeners[id](eventArgs);
        }
    }

    return {subscribe, unsubscribe, publish};
}