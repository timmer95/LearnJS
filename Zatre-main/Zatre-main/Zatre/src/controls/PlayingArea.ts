import { Board } from "../core/Board";
import { Game } from "../core/Game";
import { Point } from "../core/Point";
import { EventBus } from "../eventing/EventBus";
import { TileDragEndEvent } from "../eventing/events/TileDragEndEvent";
import { TileDragStartEvent } from "../eventing/events/TileDragStartEvent";
import { TilePlacedEvent } from "../eventing/events/TilePlacedEvent";
import { EventSubscription, EventSubscriptionGroup } from "../eventing/EventSubscription";

export class PlayingArea {
  private readonly _game: Game;
  private readonly _playingArea: HTMLDivElement;
  private readonly _eventBus: EventBus;
  private readonly _subscriptions = new EventSubscriptionGroup();

  constructor(element: HTMLDivElement, game: Game, eventBus: EventBus) {
    this._game = game;
    this._eventBus = eventBus;
    
    this._playingArea = element;
    this._playingArea.classList.add("playing-area");

    document.documentElement.style.setProperty('--board-size-in-columns', this._game.board.width.toString());
    
    /* Create the playing area. */
    for (let y = 0; y < this._game.board.height; y++) {
      for (let x = 0; x < this._game.board.width; x++) {  
        var square = this._game.board.getSquareWithTile(new Point(x, y));

        const squareElement = document.createElement("div") as HTMLDivElement;
        squareElement.classList.add("square");
        squareElement.classList.add(`square-${square.square.type.name}`)
        squareElement.setAttribute("column", x.toString());
        squareElement.setAttribute("row", y.toString());
        
        squareElement.addEventListener("drop", (event: DragEvent) => this.onTileDropped(event));
        squareElement.addEventListener("dragover", (event: DragEvent) => this.canTileBeDropped(event));

        this._playingArea.appendChild(squareElement);
      }
    }

    this._subscriptions.add(this._eventBus.subscribe("TilePlacedEvent", (event: TilePlacedEvent) => this.onTilePlaced(event)));
    this._subscriptions.add(this._eventBus.subscribe("TileDragStartEvent", (event: TileDragStartEvent) => this.onTileDragStart(event)));
    this._subscriptions.add(this._eventBus.subscribe("TileDragEndEvent", (event: TileDragEndEvent) => this.onTileDragEnd(event)));
  }

  private onTilePlaced(event: TilePlacedEvent): void {    
    const square = document.querySelector(`.square[column="${event.point.x}"][row="${event.point.y}"]`)! as HTMLDivElement;
    const tile = this.createTile(event.tile.value);
    square.appendChild(tile);
  }

  private createTile(tileValue: number) : HTMLDivElement {
    const tile = document.createElement("div");
    tile.classList.add("tile", `t${tileValue}`);
    return tile;
  }

  private onTileDropped(event: DragEvent) : void {
    const positionInTray = parseInt(event.dataTransfer!.getData("text"));
    if (positionInTray === NaN)
      event.preventDefault();

    const square = event.target as HTMLDivElement;
    const column = parseInt(square.getAttribute("column")!);
    const row = parseInt(square.getAttribute("row")!);
    this._game.placeTile(new Point(column, row), positionInTray);
  }

  private canTileBeDropped(event: DragEvent) : void {
    const positionInTray = parseInt(event.dataTransfer!.getData("text"));
    if (positionInTray === NaN)
      event.preventDefault();

    const square = event.target as HTMLDivElement;
    const column = parseInt(square.getAttribute("column")!);
    const row = parseInt(square.getAttribute("row")!);
    const squareWithTile = this._game.board.getSquareWithTile(new Point(column, row));
    
    if (!squareWithTile.tile) {
      event.preventDefault();
    }
  }
  
  private onTileDragStart(event: TileDragStartEvent): void {
    const tile = this._game.getActivePlayer().getTile(event.positionInTray);
    const availablePlacements = this._game.placementCalculator.calculatePossiblePlacements(tile);
    for (const placement of availablePlacements) {
      const square = document.querySelector(`.square[column="${placement.point.x}"][row="${placement.point.y}"]`)! as HTMLDivElement;
      square.classList.add("available");
    }
  }

  private onTileDragEnd(event: TileDragEndEvent): void {
    const availableSquares = document.querySelectorAll(".available");
    for (const square of availableSquares) {
      square.classList.remove("available");
    }
  }
  
}
