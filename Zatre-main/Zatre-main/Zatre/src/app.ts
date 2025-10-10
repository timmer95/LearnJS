import { Game } from "./core/Game";
import { Player } from "./core/Player";
import { InformationPane } from "./controls/InformationPane";
import { PlayingArea } from "./controls/PlayingArea";
import { Board } from "./core/Board";
import { EventBus } from "./eventing/EventBus";
import { SeededRandom } from "./core/SeededRandom";

const nick = new Player(1, "Nick", "#0275d8");
const kimbry = new Player(2, "Kimbry", "#5cb85c");
const joachim = new Player(3, "Joachim", "#f0ad4e");
const lisa = new Player(4, "Lisa", "#d9534f");

const eventBus = new EventBus();
const seededRandom = new SeededRandom("Hello World");
const game = new Game(eventBus, seededRandom, [nick, kimbry, joachim, lisa]);

const playingAreaElement = document.getElementById("playing-area") as HTMLDivElement;
const playingArea = new PlayingArea(playingAreaElement, game, eventBus);

const informationPaneElement = document.getElementById("information-pane") as HTMLDivElement;
const informationPane = new InformationPane(informationPaneElement, game, eventBus);

game.start();
game.drawTiles();

console.log(game);