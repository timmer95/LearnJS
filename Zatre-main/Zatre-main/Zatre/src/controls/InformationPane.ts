import { Game, GameState } from "../core/Game";
import { Player } from "../core/Player";
import { ScoreboardTable } from "../controls/ScoreboardTable";
import { TileTray } from "../controls/TileTray";
import { EventBus } from "../eventing/EventBus";
import { GameStateChangedEvent } from "../eventing/events/GameStateChangedEvent";

export class InformationPane {
  private readonly _game: Game;
  private readonly _eventBus: EventBus;
  private readonly _tabControl: HTMLDivElement;
  private readonly _tabHeader: HTMLDivElement;
  private readonly _tabIndicator: HTMLDivElement;
  private readonly _tabContent: HTMLDivElement;
  private readonly _scoreboardTables = new Map<number, ScoreboardTable>();
  private readonly _tileTrays = new Map<number, TileTray>();

  private _activeTabButton: HTMLDivElement | null = null;
  private _activeTabPage: HTMLDivElement | null = null;
  
  constructor(element: HTMLDivElement, game: Game, eventBus: EventBus) {
    this._game = game;
    this._eventBus = eventBus;

    this._tabControl = element;
    this._tabControl.classList.add("tab-control");

    /* tabHeader */
    this._tabHeader = document.createElement("div") as HTMLDivElement;
    this._tabHeader.classList.add("tab-header");
    this._tabControl.appendChild(this._tabHeader);

    /* tabIndicator */
    this._tabIndicator = document.createElement("div") as HTMLDivElement;
    this._tabIndicator.classList.add("tab-indicator");
    this._tabHeader.appendChild(this._tabIndicator);

    /* tabContent */
    this._tabContent = document.createElement("div") as HTMLDivElement;
    this._tabContent.classList.add("tab-content");
    this._tabControl.appendChild(this._tabContent);

    // Create tabs for the provided game.
    this._game.players.forEach((player: Player) => this.addPlayerTab(player));
    this.activateTab(this._game.players.keys().next().value);

    this._eventBus.subscribe("GameStateChangedEvent", (event: GameStateChangedEvent) => this.onGameStateChanged(event));
  }

  private onGameStateChanged(event: GameStateChangedEvent) : void {
    if (event.state === GameState.AwaitingDrawTiles) {
      const activePlayer = this._game.getActivePlayer();
      this.activateTab(activePlayer.id);
    }
  }

  private addPlayerTab(player: Player) {
    /* tabButton */
    const tabButton = this.createTabButton(player.id, player.name);
    this._tabHeader.appendChild(tabButton);
    
    /* tabPage */
    const tabPage = this.createTabPage(player.id);
    this._tabContent.appendChild(tabPage);
    
    /* scoreboardTable */
    const scoreboardTableElement = document.createElement("table") as HTMLTableElement;
    tabPage.appendChild(scoreboardTableElement);
    const scoreboardTable = new ScoreboardTable(scoreboardTableElement, player, this._eventBus);
    this._scoreboardTables.set(player.id, scoreboardTable);

    /* tileTray */
    const tileTrayElement = document.createElement("div") as HTMLDivElement;
    tabPage.appendChild(tileTrayElement);
    const tileTray = new TileTray(tileTrayElement, player, this._eventBus);
    this._tileTrays.set(player.id, tileTray);
  }

  private createTabButton(tabIndex: number, caption: string) : HTMLDivElement {
    const tabButton = document.createElement("div") as HTMLDivElement;
    tabButton.classList.add("tab-button");
    tabButton.setAttribute("tab-index", tabIndex.toString());
    tabButton.innerText = caption;
    tabButton.addEventListener("click", () => this.activateTab(tabIndex));

    return tabButton;
  }

  private createTabPage(tabIndex: number) : HTMLDivElement {
    const tabPage = document.createElement("div") as HTMLDivElement;
    tabPage.classList.add("tab-page");
    tabPage.setAttribute("tab-index", tabIndex.toString());

    return tabPage;
  }

  private activateTab(tabIndex: number) : void {
    // Deactivate currently activated tabButton.
    if (this._activeTabButton) {
      this._activeTabButton.classList.remove("tab-button-active");
      this._tabIndicator.style.width = "0px";
    }

    // Activate requested tabButton.
    this._activeTabButton = this._tabControl.querySelectorAll('.tab-button[tab-index="' + tabIndex + '"]')[0] as HTMLDivElement;
    if (this._activeTabButton) {
      this._activeTabButton.classList.add("tab-button-active");
      const boundingRect = this._activeTabButton.getBoundingClientRect();
      this._tabIndicator.style.width = Math.round(this._activeTabButton.offsetWidth) + "px";
      this._tabIndicator.style.left = Math.round(boundingRect.left) + "px";
      this._tabIndicator.style.top = Math.round(boundingRect.bottom) + "px";
    }
    
    // Deactivate currently activated tabPage.
    if (this._activeTabPage) {
      this._activeTabPage.classList.remove("tab-page-active");
    }

    // Activate corresponding tabPage.
    this._activeTabPage = this._tabControl.querySelectorAll('.tab-page[tab-index="' + tabIndex + '"]')[0] as HTMLDivElement;
    if (this._activeTabPage) {
      this._activeTabPage.classList.add("tab-page-active");
    }
    
    // Apply the player color.
    if (this._game.players.has(tabIndex)) {
      const player = this._game.players.get(tabIndex)!;
      document.documentElement.style.setProperty('--tab-accent', player.color);
    } else {
      // This will effectively reset to the value defined in css.
      document.documentElement.style.setProperty('--tab-accent', "");
    }
  }
}