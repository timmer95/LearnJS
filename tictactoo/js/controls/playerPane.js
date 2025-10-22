import { ProvidedNameEvent } from '../eventing/events/ProvidedNameEvent.js'
import { ResetGameEvent } from '../eventing/events/ResetGameEvent.js';
import { createPlayer } from '../core/createPlayer.js'

export function createPlayerPane(
    eventBus, 
    gameInstance
) {
    // Subscriptions
    eventBus.subscribe(ProvidedNameEvent.name, (event) => onProvidedNameEvent(event));
    eventBus.subscribe(ResetGameEvent.name, (event) => onResetGameEvent(event));

    // Make both player names publishers
    ['X', 'O'].forEach(symbol => {
        const inputFieldId = "player" + symbol + "Name";
        const inputElem = document.getElementById(inputFieldId)
        inputElem.addEventListener('change', () => {
            eventBus.publish(ProvidedNameEvent.name, new ProvidedNameEvent(symbol, inputElem.value));
        })
    })

    function onProvidedNameEvent(event) {
        // Add a player instance to the game
        gameInstance.addPlayer(createPlayer(event.playerId, event.playerName));
        // Also, we update the corresponding names in the yet hidden game HTML 
        document.getElementById("name" + event.playerId).textContent = event.playerName;
    }

    // Empty the earlier provided player names
    function onResetGameEvent(event) {
        ['X', 'O'].forEach(symbol => {
            const inputFieldId = "player" + symbol + "Name";
            const inputElem = document.getElementById(inputFieldId);
            inputElem.value = '';
        });
    }
}