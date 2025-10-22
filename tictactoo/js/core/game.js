import { createGameboard } from './createGameboard.js'
import { GameOverEvent } from '../eventing/events/GameOverEvent.js';
import { SentMessageEvent } from '../eventing/events/SentMessageEvent.js';

export function createGameController(eventBus) {
    let board = createGameboard(3);
    let players = Array();
    let activeI = -1;
    let activePlayer;
    let placedSymbol = "Y";

    // Adds a player to the game
    function addPlayer(player) {
        players.push(player);
    };    

    // Places symbol on the board, alternating the turn
    function placeSymbol(x, y) {
        const symbol = players[activeI].getSymbol();
        board.placeSymbol(symbol, x, y);
        placedSymbol = symbol;
        takeTurn();
    }

    // Retrieves the previously placed symbol to show in the box
    function getPlacedSymbol() {
        return placedSymbol;
    }

    // Alternates the turn if the game is not finished yet
    function takeTurn() {
        let message;
        const gameStatus = board.checkStatus();
        if (gameStatus == "nobody") { // As long as nobody has won
            if (!board.isBoardFull()) { // And there is still available space
                // Next player becomes active player
                if (activeI < (players.length - 1)) {
                    activeI++;
                } else {
                    activeI = 0;
                }
                activePlayer = players[activeI];

                message = `Player ${activePlayer.getSymbol()}, pick your box!`;
            } else { // When there is no space available ...
                message = `You both failed. Start a new game!`;
                eventBus.publish(GameOverEvent.name, new GameOverEvent());
            }
        } else { // Somebody has won
            message = `Player ${gameStatus} has won!`;
            //// Is it ugly to have a publisher in a core part? Feels like it must be in controls, but it suits the best here imo
            eventBus.publish(GameOverEvent.name, new GameOverEvent())
        }
        eventBus.publish(SentMessageEvent.name, new SentMessageEvent(message))    
    }

    //// Is this an ugly function?
    function reset({fullReset = true}) {
        board = createGameboard(3);
        activeI = -1;
        placedSymbol = "Y";
        if (fullReset) {
            // Fresh player names must be provided 
            players = Array();
        } else {
            // If the players remain, we should take turn instead
            takeTurn();
        }
    }

    return {addPlayer, placeSymbol, getPlacedSymbol, reset, takeTurn};
};