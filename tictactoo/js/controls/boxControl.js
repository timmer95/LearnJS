import { GameOverEvent } from '../eventing/events/GameOverEvent.js';
import { ReplayGameEvent } from '../eventing/events/ReplayGameEvent.js';
import { SelectedBoxEvent } from '../eventing/events/SelectedBoxEvent.js'
import { PlacedSymbolEvent } from '../eventing/events/PlacedSymbolEvent.js';
import { ResetGameEvent } from '../eventing/events/ResetGameEvent.js';
import { SentMessageEvent } from '../eventing/events/SentMessageEvent.js';

export function createBoxesControl(
    eventBus,
    gameInstance,
) {
    // Subscriptions   
    eventBus.subscribe(SelectedBoxEvent.name, (event) => onSelectedBoxEvent(event));
    
    // Add EventListeners to all the boxes
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const tempId = i.toString() + ' ' + j.toString();
            const tempBox = document.getElementById(tempId);

            // Let the box publish an event when selected
            tempBox.addEventListener('click', () => {
                eventBus.publish(SelectedBoxEvent.name, new SelectedBoxEvent(i, j));
            })

            // And then subscribe the box to the event to show the symbol
            eventBus.subscribe(PlacedSymbolEvent.name + tempId, (event) => onSentSymbolEvent(event, tempBox));  //// ugly way to deal with different events per box? 
            
            //// The following functions could have been aggregated to apply to ALL boxes at once instead of 1 subscriber per box
            // Subscribe the box to be disabled when game is over
            eventBus.subscribe(GameOverEvent.name, (event) => onGameOverEvent(event, tempBox))
            // Subscribe the box te be enabled and empty when game Replays or resets
            eventBus.subscribe(ReplayGameEvent.name, (event) => onReplayGameEvent(event, tempBox))
            eventBus.subscribe(ResetGameEvent.name, (event) => onResetGameEvent(event, tempBox))
        }
    }
    
    function onSelectedBoxEvent(event) {
        try {
            gameInstance.placeSymbol(event.x, event.y);
            const tempId = event.x.toString() + ' ' + event.y.toString();
            eventBus.publish(PlacedSymbolEvent.name + tempId, new PlacedSymbolEvent(gameInstance.getPlacedSymbol()));
        } catch (error) {
            eventBus.publish(SentMessageEvent.name, new SentMessageEvent(error));
        }
    }

    function onSentSymbolEvent(event, box) {
        box.textContent = event.symbol
    }

    function onGameOverEvent(event, box) {
        box.disabled = true;
    }  

    function resetBox(box) {
        box.textContent = "";
        box.disabled = false;
    }

    function onReplayGameEvent(event, box) {
        resetBox(box);
    }

    function onResetGameEvent(event, box) {
        resetBox(box);
    }
}