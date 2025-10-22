
import { createGameController} from './core/game.js'
import { createEventBus } from './eventing/EventBus.js'
import { createPlayerPane } from "./controls/playerPane.js";
import { createBoxesControl } from "./controls/boxControl.js";
import { gameControl } from './controls/gameControl.js';
import { createMessageField } from './controls/messageField.js';


window.onload = function() {
    console.log(' > > > START > > > ')
    const   eventBus = createEventBus();
    let     game = createGameController(eventBus);
    const   playerPanes  = createPlayerPane(eventBus, game);
    const   controllingBoxes = createBoxesControl(eventBus, game);
    const   messageField = createMessageField(eventBus);
    const   controllingGame = gameControl(eventBus, game);
};


//// I removed all the game states to gameControl, but maybe it would better belong here
