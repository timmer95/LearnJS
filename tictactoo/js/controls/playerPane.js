import { ProvidedNameEvent } from '../eventing/events/ProvidedNameEvent.js'

export function createPlayerPane(eventBus, inputFieldId, gameInstance, symbol) {

    eventBus.subscribe(ProvidedNameEvent.name, (event) => onProvidedNameEvent(event));

    // We subscribe the gameInstance to the ProvidedNameEvent as a listener, something that must happen internally
    function onProvidedNameEvent(event) {
        gameInstance.addPlayer(event.playerId, event.playerName);
    }

    const inputElem = document.getElementById(inputFieldId)
    inputElem.addEventListener('change', () => {
        eventBus.publish(ProvidedNameEvent.name, new ProvidedNameEvent(symbol, inputElem.value));
    })
}