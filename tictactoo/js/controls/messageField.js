import { SentMessageEvent } from "../eventing/events/SentMessageEvent.js"

export function createMessageField(
    eventBus
) {
    // Subscriptions
    eventBus.subscribe(SentMessageEvent.name, (event) => onSentMessageEvent(event));

    function onSentMessageEvent(event) {
        document.getElementById("messageField").textContent = event.message;
    }
}