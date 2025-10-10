import { EventBus } from "../eventing/EventBus";
import { SeededRandom } from "./SeededRandom";
import { Player } from "./Player";
import { Bag } from "./Bag";
import { Board } from "./Board";
import { Point } from "./Point";
import { TilePlacedEvent } from "../eventing/events/TilePlacedEvent";
import { TileDrawnEvent } from "../eventing/events/TileDrawnEvent";
import { GameStateChangedEvent } from "../eventing/events/GameStateChangedEvent";
import { PlacementCalculator } from "./PlacementCalculator";
import { Axis } from "./Axis";
import { LineScoredEvent } from "../eventing/events/LineScoredEvent";

export enum GameState {
  AwaitingStart,
  AwaitingDrawTiles,
  AwaitingPlaceTiles,
  AwaitingFinishTurn,
  Finished
}

export class Game {
  private readonly _seededRandom : SeededRandom;
  private readonly _eventBus : EventBus;
  private readonly _playerIds: Array<number>;
  private readonly _bag : Bag;
  
  private _gameState = GameState.AwaitingStart;
  private _turn = 0;
  private _activePlayerIndex = 0;
  
  public readonly players : Map<number, Player>;
  public readonly board : Board;
  public readonly placementCalculator: PlacementCalculator;

  constructor(eventBus : EventBus, seededRandom : SeededRandom, players : Array<Player>) {
    this._eventBus = eventBus;
    this._seededRandom = seededRandom;
    this.players = new Map(seededRandom.shuffle(players).map(x => [x.id, x]));
    this._playerIds = [ ...this.players.keys() ];
    this._bag = new Bag(seededRandom);
    this.board = new Board();
    this.placementCalculator = new PlacementCalculator(this.board);
  }

  public start() : void {
    if (this._gameState !== GameState.AwaitingStart)
      throw new Error("Can't start the game if it has already been started.");

    this.setGameState(GameState.AwaitingDrawTiles);
  }

  public drawTiles() : void {
    if (this._gameState !== GameState.AwaitingDrawTiles)
      throw new Error("Can't draw tiles at this time.");

    const activePlayer = this.getActivePlayer();

    // The player will normally draw 2 tiles, unless the bag only has a single tile left.
    // We shouldn't get here if the bag is already empty, so we can ignore that case.
    let numberOfTilesToDraw = this._turn === 0 ? 3 : Math.min(2, this._bag.count());

    // If the active player has two or more tiles left, check whether they can be placed.
    // If at least one can be placed, then he cannot draw any tiles.
    const tilesInTray = activePlayer.getTiles();
    if (tilesInTray.length >= 2) {
      const tiles = tilesInTray.map(x => x.tile);
      const tileCanBePlaced = this.placementCalculator.canPlaceAtLeastOne(tiles);
      if (tileCanBePlaced) {
        this.setGameState(GameState.AwaitingPlaceTiles);

        // We have to return here, nothing else needs to happen.
        return;
      }
    }
    
    // If the active player has one tile OR he has two or more but cannot play them,
    // then he can only draw a single tile.
    if (tilesInTray.length >= 1) {
      numberOfTilesToDraw = 1;
    }

    // The active player can draw the specified number of tiles.
    for (let i = 0; i < numberOfTilesToDraw; i++) {
      const tile = this._bag.takeTile();
      const tileSlot = activePlayer.addTile(tile);
      this._eventBus.publish("TileDrawnEvent", new TileDrawnEvent(tile, activePlayer, tileSlot))
    }

    // Check whether the active player can actually place the drawn tiles.
    // If not, we have to skip placing the tiles.
    const tiles = activePlayer.getTiles().map(x => x.tile);
    const tileCanBePlaced = this.placementCalculator.canPlaceAtLeastOne(tiles);
    if (tileCanBePlaced) {
      this.setGameState(GameState.AwaitingPlaceTiles);
    } else {
      this.setGameState(GameState.AwaitingFinishTurn);
    }
  }

  public placeTile(point : Point, positionInTray: number) {
    if (this._gameState !== GameState.AwaitingPlaceTiles)
      throw new Error("Can't place tiles at this time.");

    const activePlayer = this.getActivePlayer();
    const tile = activePlayer.getTile(positionInTray);

    // Check whether the placement is valid.
    if (!this.placementCalculator.isValidPlacement(point, tile))
      throw new Error("This isn't a valid placement.");
      
    // Do the actual placement.
    activePlayer.removeTile(positionInTray);    
    this.board.placeTile(point, tile);

    // Update the placement calculator.
    const squareWithTile = this.board.getSquareWithTile(point);
    this.placementCalculator.updateAfterTilePlaced(squareWithTile, activePlayer);

    // Publish the TilePlaced event.
    this._eventBus.publish("TilePlacedEvent", new TilePlacedEvent(point, tile, activePlayer, positionInTray))

    // Update the scores and publish events.
    for(const axis of [Axis.HORIZONTAL, Axis.VERTICAL]) {
      const line = this.board.findLineAlongAxis(squareWithTile, axis);
      if (line.value >= 10) {
        const changedScores = activePlayer.scoreboard.addScore(squareWithTile.square, line);
        this._eventBus.publish("LineScoredEvent", new LineScoredEvent(activePlayer, changedScores));
      }
    }

    // Finally, check whether the player has placements left.
    const tiles = activePlayer.getTiles().map(x => x.tile);
    if (tiles.length === 0 || !this.placementCalculator.canPlaceAtLeastOne(tiles))
      this.setGameState(GameState.AwaitingFinishTurn);
  }

  public finishTurn() {
    if (this._gameState !== GameState.AwaitingFinishTurn)
      throw new Error("Can't finish turn at this time.");
      
    this._turn++;

    // Update the placement calculator.
    this.placementCalculator.updateAfterPlayerTurn();

    // Update the scoreboard.
    this.getActivePlayer().scoreboard.finishTurn();

    // If the bag is empty at this point, the game is finished.
    if (this._bag.isEmpty()) {
      this.finishGame();

      // No further action is required.
      return;
    }

    // Move to the next player.
    if (this._activePlayerIndex === this._playerIds.length - 1) {
      this._activePlayerIndex = 0;
    } else {
      this._activePlayerIndex++;
    }
    
    // Update state.
    this.setGameState(GameState.AwaitingDrawTiles);
  }

  private finishGame() : void {
    this.players.forEach(player => 
    {
      const leftoverTiles = player.getTiles().map(x => x.tile);
      player.scoreboard.calculateFinalScore(leftoverTiles);
    });

    this.setGameState(GameState.Finished);
  }

  public getActivePlayer() : Player {
    const id = this._playerIds[this._activePlayerIndex];
    return this.players.get(id)!;
  }

  private setGameState(newState: GameState) {
    this._gameState = newState;
    this._eventBus.publish("GameStateChangedEvent", new GameStateChangedEvent(newState));
  }
}