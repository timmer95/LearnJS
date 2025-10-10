import _ from "lodash";
import { Player } from "../core/Player";
import { EventBus } from "../eventing/EventBus";
import { LineScoredEvent } from "../eventing/events/LineScoredEvent";
import { EventSubscription } from "../eventing/EventSubscription";

export class ScoreboardTable {
  private readonly _numberOfRowsPerPage = 18;
  private readonly _numberOfColumns = 7;

  private readonly _player: Player;
  private readonly _eventBus: EventBus;
  private readonly _scoreboardTable: HTMLTableElement;
  private readonly _scoreTableHeader: HTMLTableSectionElement;
  private readonly _scoreTableBody: HTMLTableSectionElement;
  private readonly _pagingRow: HTMLTableRowElement;
  private readonly _pagingCell: HTMLTableCellElement;
  private readonly _previous: HTMLAnchorElement;
  private readonly _next: HTMLAnchorElement;
  private readonly _minusField: HTMLTableCellElement;
  private readonly _totalField: HTMLTableCellElement;
  private readonly _onLineScoredSubscription: EventSubscription;

  private _nextPageNumber = 1;
  private _activePageNumber = 0;

  constructor(element: HTMLTableElement, player: Player, eventBus: EventBus) {
    this._player = player;
    this._eventBus = eventBus;

    this._scoreboardTable = element;
    this._scoreboardTable.classList.add("score-table"); 

    /* Header */
    this._scoreTableHeader = document.createElement("thead") as HTMLTableSectionElement;
    this._scoreboardTable.appendChild(this._scoreTableHeader);

    const headerRow = document.createElement("tr") as HTMLTableRowElement;
    this._scoreboardTable.appendChild(headerRow);

    const appendTh = (text: string) => {
      const th = document.createElement("th") as HTMLTableCellElement;
      th.innerText = text;
      headerRow.appendChild(th);
    }

    appendTh("");
    appendTh("x2");
    appendTh("10 (1)");
    appendTh("11 (2)");
    appendTh("12 (4)");
    appendTh("Bonus");
    appendTh("Total");

    this._scoreTableHeader.appendChild(headerRow);
        
    /* Body */
    this._scoreTableBody = document.createElement("tbody") as HTMLTableSectionElement;
    this._scoreboardTable.appendChild(this._scoreTableBody);

    /* Paging */
    this._pagingRow = document.createElement("tr") as HTMLTableRowElement;
    this._pagingRow.classList.add("score-table-paging");

    this._pagingCell = document.createElement("td") as HTMLTableCellElement;
    this._pagingCell.setAttribute("colspan", this._numberOfColumns.toString());    
    this._pagingRow.appendChild(this._pagingCell);

    this._previous = document.createElement("a") as HTMLAnchorElement;    
    this._previous.classList.add("navigation");
    this._previous.innerText = "<";
    this._previous.addEventListener("click", () => this.activatePreviousPage());
    this._pagingCell.appendChild(this._previous);
    
    this._next = document.createElement("a") as HTMLAnchorElement;
    this._next.classList.add("navigation");
    this._next.innerText = ">";
    this._next.addEventListener("click", () => this.activateNextPage());
    this._pagingCell.appendChild(this._next);

    this._scoreTableBody.appendChild(this._pagingRow);
    
    const page = this.addPage();
    this.activatePage(page);
    
    /* Minus */
    const minus = this.createSummaryRow("Minus");
    this._scoreTableBody.appendChild(minus.summaryRow);
    this._minusField = minus.summaryField;

    /* Total */
    const total = this.createSummaryRow("Total");
    this._scoreTableBody.appendChild(total.summaryRow);
    this._totalField = total.summaryField;

    this._onLineScoredSubscription = this._eventBus.subscribe("LineScoredEvent", (event: LineScoredEvent) => this.onLineScored(event));
  }

  private onLineScored(event: LineScoredEvent): void {
    if (this._player !== event.player)
      return;

    const changedMultiplier = event.changedScores[0];
    const changedTen = event.changedScores[1];
    const changedEleven = event.changedScores[2];
    const changedTwelve = event.changedScores[3];
    
    if (changedMultiplier !== undefined) {
      const row = this._scoreboardTable.querySelector(`.score-table-row[row="${changedMultiplier}"]`) as HTMLTableRowElement;
      const cell = row.childNodes[1] as HTMLTableCellElement;
      cell.innerText = _.repeat("X", this._player.scoreboard.getTurn(changedMultiplier)[0]);
    }
    
    if (changedTen !== undefined) {
      const row = this._scoreboardTable.querySelector(`.score-table-row[row="${changedTen}"]`) as HTMLTableRowElement;
      const cell = row.childNodes[2] as HTMLTableCellElement;
      cell.innerText = _.repeat("X", this._player.scoreboard.getTurn(changedTen)[1]);
    }
    
    if (changedEleven !== undefined) {
      const row = this._scoreboardTable.querySelector(`.score-table-row[row="${changedEleven}"]`) as HTMLTableRowElement;
      const cell = row.childNodes[3] as HTMLTableCellElement;
      cell.innerText = _.repeat("X", this._player.scoreboard.getTurn(changedEleven)[2]);
    }
    
    if (changedTwelve !== undefined) {
      const row = this._scoreboardTable.querySelector(`.score-table-row[row="${changedTwelve}"]`) as HTMLTableRowElement;
      const cell = row.childNodes[4] as HTMLTableCellElement;
      cell.innerText = _.repeat("X", this._player.scoreboard.getTurn(changedTwelve)[3]);
    }
  }

  private createSummaryRow(caption: string) : { summaryRow: HTMLTableRowElement, summaryField: HTMLTableCellElement } {
    const summaryRow = document.createElement("tr") as HTMLTableRowElement;
    summaryRow.classList.add("score-table-summary");
    
    const summaryCaption = document.createElement("td") as HTMLTableCellElement;
    summaryCaption.setAttribute("colspan", (this._numberOfColumns - 1).toString());
    summaryCaption.innerText = caption;
    summaryRow.appendChild(summaryCaption);
    
    const summaryField = document.createElement("td") as HTMLTableCellElement;
    summaryRow.appendChild(summaryField);

    return { summaryRow, summaryField };
  }

  private addPage() : number {
    const pageNumber = this._nextPageNumber++;
    const pageLink = document.createElement("a");
    pageLink.classList.add("navigation");
    pageLink.innerText = pageNumber.toString();
    pageLink.addEventListener("click", () => this.activatePage(pageNumber));
    pageLink.setAttribute("page", pageNumber.toString());
    this._pagingCell.insertBefore(pageLink, this._next);
    
    for (let r = 0; r < this._numberOfRowsPerPage; r++) {
      const tr = document.createElement("tr") as HTMLTableRowElement;
      tr.classList.add("score-table-row");
      const rowNumber = ((pageNumber - 1) * this._numberOfRowsPerPage) + r;
      tr.setAttribute("row", rowNumber.toString());
      tr.setAttribute("page", pageNumber.toString());
      this._scoreTableBody.insertBefore(tr, this._pagingRow);

      for (let c = 0; c < this._numberOfColumns; c++) {
        const td = document.createElement("td") as HTMLTableCellElement;
        tr.appendChild(td);

        if (c === 0)
          td.innerText = `#${rowNumber}`;
      }
    }

    return pageNumber;
  }

  private activatePreviousPage() : void {
    if (this._activePageNumber > 1)
      this.activatePage(this._activePageNumber - 1);
  }
  
  private activateNextPage() : void {
    if (this._activePageNumber < this._nextPageNumber - 1)
      this.activatePage(this._activePageNumber + 1);
  }

  private activatePage(pageNumber: number) : void {
    this._activePageNumber = pageNumber;

    /* Deactivate the current page. */
    const activeLink = this._scoreboardTable.querySelector("a.active");
    if (activeLink)
      activeLink.classList.remove("active");

    const activeRows = this._scoreboardTable.querySelectorAll("tr.active");
    activeRows.forEach(element => {
      element.classList.remove("active");
    });

    /* Activate the new page. */
    const linkToActivate = this._scoreboardTable.querySelector(`.navigation[page="${pageNumber}"]`);
    if (linkToActivate)
    linkToActivate.classList.add("active");

    this._activePageNumber = pageNumber;
    const rowsToActivate = this._scoreboardTable.querySelectorAll(`.score-table-row[page="${pageNumber}"]`);
    rowsToActivate.forEach(element => {
      element.classList.add("active");
    });
  }
}