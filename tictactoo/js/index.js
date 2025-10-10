import { tictactoe } from "./gameObjects.js";
import {addFunctionToButton } from "./interactivity.js"


const states = ['askPlayer1', 'askPlayer2', 'game', 'gameOver'];
let currentStateIndex = 0;

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
    // Initialize
    showState(states[currentStateIndex]);

    const game = tictactoe().createGameController(3, ["X", "O"]);

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