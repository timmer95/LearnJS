import { tictactoe } from "./gameObjects.js";
import {addFunctionToButton } from "./interactivity.js"


export const game = tictactoe().createGameController(3, ["X", "O"]);