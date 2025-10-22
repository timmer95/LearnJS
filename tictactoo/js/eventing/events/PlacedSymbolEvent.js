export class PlacedSymbolEvent {
    constructor(symbol) { 
        this.symbol = symbol;
    }
}

// Hmm, i think i need a separate event per box. right? because now i have this ugly
// solution to include the box coordinates in the name (see boxControl.js)