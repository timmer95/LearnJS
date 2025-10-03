import { tictactoe } from "./gameObjects.js";
import {addFunctionToButton } from "./interactivity.js"


const game = tictactoe().createGameController(3, ["X", "O"]);

addFunctionToButton("reset", () => {
    game.reset();
});
