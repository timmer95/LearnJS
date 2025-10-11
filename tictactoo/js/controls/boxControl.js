import { SelectedBoxEvent } from '../eventing/events/SelectedBoxEvent.js'
import { SentSymbolEvent } from '../eventing/events/SentSymbolEvent.js';

export function createBoxesControl(
    eventBus,
    gameInstance,
) {
    // Subscribe the gameInstance board to the Event
    eventBus.subscribe(SelectedBoxEvent.name, (event) => onSelectedBoxEvent(event));
    
    // Function to execute upon subscription
    function onSelectedBoxEvent(event) {
        gameInstance.placeSymbol(event.x, event.y);
        const tempId = event.x.toString() + ' ' + event.y.toString();
        eventBus.publish(SentSymbolEvent.name + tempId, new SentSymbolEvent(gameInstance.getActiveSymbol()));
    }

    function onSentSymbolEvent(event, box) {
        console.log(`Put symbol ${event.symbol} on box`);
        box.textContent = event.symbol
    }

    // Functionality to publish the event
    // Add EventListeners to all the boxes
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const tempId = i.toString() + ' ' + j.toString();
            const tempBox = document.getElementById(tempId);
            console.log('Publish and Subscribe those bithces')
            // Let the box publish an event
            tempBox.addEventListener('click', () => {
                eventBus.publish(SelectedBoxEvent.name, new SelectedBoxEvent(i, j));
            })
            // And then subscribe the box to the event to show the symbol (must be two separated Events, I guess...)
            eventBus.subscribe(SentSymbolEvent.name + tempId, (event) => onSentSymbolEvent(event, tempBox));
        }
    }


}