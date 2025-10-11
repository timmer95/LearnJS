import { tictactoe } from "./core/gameObjects.js";
import {addFunctionToButton } from './controls/interactiveFunctions.js'
import { createEventBus } from './eventing/EventBus.js'
import { createPlayerPane } from "./controls/playerPane.js";


const states = ['askPlayer1', 'askPlayer2', 'game', 'gameOver'];
let currentStateIndex = 0;

const eventBus = createEventBus();
const game = tictactoe().createGameController();
const playerX = createPlayerPane(eventBus, 'playerX', game, 'X');
const playerO = createPlayerPane(eventBus, 'playerO', game, 'O');

function showState(stateName) {
  states.forEach(id => {
    document.getElementById(id).style.display = id === stateName ? 'block' : 'none';
  });
}

function goToState(stateName) {
    function showState() {
        currentStateIndex = states.indexOf(stateName);
        states.forEach(id => {
            document.getElementById(id).style.display = id === stateName ? 'block' : 'none';
        });
        }
    return showState
}

function next() {
  if (currentStateIndex < states.length - 1) {
    currentStateIndex++;
    showState(states[currentStateIndex]);
  }
}



window.onload = function() {
    console.log('START')
    // Initialize
    showState(states[currentStateIndex]);

    // State transitions
    addFunctionToButton("nextPlayer", next);
    addFunctionToButton("startGame", next)
    addFunctionToButton('endGame', next);
    addFunctionToButton('playAgain', goToState('game'));
    addFunctionToButton('resetGame', goToState('askPlayer1'));

    // Additional game functionality
    addFunctionToButton("reset", game.reset);
    addFunctionToButton('continue', game.runRound);

};