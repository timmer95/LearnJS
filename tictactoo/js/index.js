import { tictactoe } from "./gameObjects.js";
import {addFunctionToButton } from "./interactivity.js"


const states = ['askPlayer1', 'askPlayer2', 'game', 'gameOver'];
let currentStateIndex = 0;

window.onload = function() {
    const game = tictactoe().createGameController(3, ["X", "O"]);
    addFunctionToButton("reset", game.reset);
    addFunctionToButton('continue', game.runRound);
    // diabled buttons when filled
};



function showState(stateName) {
  states.forEach(id => {
    document.getElementById(id).style.display = id === stateName ? 'block' : 'none';
  });
}

function next() {
  if (currentStateIndex < states.length - 1) {
    currentStateIndex++;
    showState(states[currentStateIndex]);
  }
}

function endGame() {
  currentStateIndex = states.indexOf('gameOver');
  showState('gameOver');
}

// Initialize
showState(states[currentStateIndex]);

