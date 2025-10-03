import { tictactoe } from "./gameObjects.js";
import {addFunctionToButton } from "./interactivity.js"


window.onload = function() {
    const game = tictactoe().createGameController(3, ["X", "O"]);

    addFunctionToButton("reset", game.reset);
    addFunctionToButton('continue', game.runRound);
};
