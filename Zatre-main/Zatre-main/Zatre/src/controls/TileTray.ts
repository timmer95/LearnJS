import { parseInt } from "lodash";
import { Game } from "../core/Game";
import { Player } from "../core/Player";
import { EventBus } from "../eventing/EventBus";
import { TileDragEndEvent } from "../eventing/events/TileDragEndEvent";
import { TileDragStartEvent } from "../eventing/events/TileDragStartEvent";
import { TileDrawnEvent } from "../eventing/events/TileDrawnEvent";
import { TilePlacedEvent } from "../eventing/events/TilePlacedEvent";
import { EventSubscriptionGroup } from "../eventing/EventSubscription";

export class TileTray {
  private readonly _numberOfSlots = 5;

  private readonly _player: Player;
  private readonly _eventBus: EventBus;
  private readonly _tileTray: HTMLDivElement;
  private readonly _subscriptions = new EventSubscriptionGroup();

  constructor(element: HTMLDivElement, player: Player, eventBus: EventBus) {
    this._player = player;
    this._eventBus = eventBus;
    this._subscriptions.add(eventBus.subscribe("TileDrawnEvent", (event: TileDrawnEvent) => this.onTileDrawn(event)));
    this._subscriptions.add(eventBus.subscribe("TilePlacedEvent",  (event: TilePlacedEvent) => this.onTilePlaced(event)));

    this._tileTray = element;
    this._tileTray.classList.add("tile-tray");
    
    for (let i = 0; i < this._numberOfSlots; i++) {
      const slot = document.createElement("div");
      slot.setAttribute("tile-slot", i.toString());
      slot.classList.add("tile-slot");    
      this._tileTray.appendChild(slot);
    }
  }

  private onTilePlaced(event: TilePlacedEvent): void {
    if (event.player === this._player) {
      const slot = this._tileTray.children[event.positionInTray];
      const tile = slot.children[0];
      tile.remove();
    }
  }

  private onTileDrawn(event: TileDrawnEvent): void {
    if (event.player === this._player) {
      const slot = this._tileTray.children[event.positionInTray];
      const tile = this.createTile(event.tile.value);
      slot.appendChild(tile);
    }
  }

  private createTile(tileValue: number) : HTMLDivElement {
    const tile = document.createElement("div");
    tile.classList.add("tile", `t${tileValue}`);
    tile.setAttribute("draggable", "true");
    tile.addEventListener("dragstart", e => this.onTileDragStart(e));
    tile.addEventListener("dragend", e => this.onTileDragEnd(e));
    return tile;
  }
  
  private onTileDragStart(event: DragEvent) : void {
    const tile = event.target as HTMLDivElement;
    const square = tile.parentNode as HTMLDivElement;
    const positionInTray = square.getAttribute("tile-slot")!;
    event.dataTransfer!.setData("text", positionInTray);

    this._eventBus.publish("TileDragStartEvent", new TileDragStartEvent(parseInt(positionInTray)));
  }
  
  private onTileDragEnd(event: DragEvent) : void {
    this._eventBus.publish("TileDragEndEvent", new TileDragEndEvent());
  }
}