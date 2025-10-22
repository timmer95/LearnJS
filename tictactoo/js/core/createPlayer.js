export function createPlayer(symbol, name) {

        function getSymbol() {
            return symbol;
        }

        console.log(`Created player ${symbol} for ${name}`)

        return {name, getSymbol};
    };