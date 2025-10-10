import { InvalidMoveFormatError, InvalidMoveLocationError } from "./errors.js";
import { placeSymbolInBox, emptyAllBoxes } from "./interactivity.js"

export function tictactoe () {
    function createPlayer(symbol, name) {
        
        function getMove() {
            const moveFullString = prompt(`${name}, what will be your next move? (x y) with 0-based index`);
            const [ xString, yString ] = moveFullString.split(" ");
            const x = Number(xString);
            const y = Number(yString);
            return { symbol, x, y };
        }

        // alert(`Created player ${symbol} for ${name}`)

        return {name, getMove};
    };

    function createGameboard(size) {
        const _board = Array(size);
        let i = 0
        while (i < size) {
            _board[i] = Array(size).fill('')
            i ++;
        }

        function placeSymbol(symbol, x, y) {
            if (isEmptyLocation( x, y)) {
                _board[y][x] = symbol
            }
        }

        function isEmptyLocation( x, y) {
            if (_board[y][x] != "") {
                throw new InvalidMoveLocationError(`You cannot place at (${x}, ${y}), it is occupied`)
            };
            return true;
        }

        function getBoard() {
            return _board
        }

        function checkStatus() {
            const winners = [ checkRows(), checkCols(), checkDiagonal1(), checkDiagonal2() ];
            let result = 'continue';
            winners.forEach(winner => {
                if (winner != "nobody") {
                    result = winner;
                }
            })
            if (isBoardFull()) {
                result = "nobody"
            }     
            return result;

        }

        function isBoardFull() {
            let full = true;
            _board.forEach(row => {
                row.forEach(item => {
                    if (item === "") {
                        full = false;
                    }
                })
            })
            return full;
        }

        function checkRows() {
            let winner = "nobody";
            _board.forEach(row => {
                let { fullRow, firstItem } = checkRow(row);
                if (fullRow) {
                    winner = firstItem;
                } 
            })
            return winner;

        }

        function checkRow(row) {
            let fullRow = true;
            let firstItem = (row[0] != "") ? row[0] : "nobody";

            row.forEach(item => {
                fullRow = fullRow && item === firstItem;
            })
            return { fullRow, firstItem };
        }

        function checkCols() {
            let winner = "nobody";
            for (let c = 0; c < size; c++) {
                let fullCol = true;
                let firstItem = (_board[0][c] != "") ? _board[0][c] : "nobody";
                for (let r = 0; r < size; r++) {
                    fullCol = fullCol && _board[r][c] === firstItem; 
                }
                if (fullCol) {
                    winner = firstItem;
                }
            }
            return winner;

        }

        function checkDiagonal1() {
            let fullDiagonal = true;
            const firstItem = (_board[0][0] != "") ? _board[0][0] : "nobody";
            for (let i = 0; i < size; i++) {
                fullDiagonal = fullDiagonal && _board[i][i] === firstItem;
            }
            const winner = fullDiagonal? firstItem : "nobody";
            return winner;
        }

        function checkDiagonal2() {
            let fullDiagonal = true;
            const firstItem = (_board[ size - 1 ][0] != "") ? _board[ size - 1 ][0] : "nobody";
            for (let i = 0; i < size; i++) {
                fullDiagonal = fullDiagonal && _board[ size - 1 - i][i] === firstItem;
            }
            const winner = fullDiagonal? firstItem : "nobody";
            return (winner != "") ? winner : "nobody";
        }

        return { getBoard, placeSymbol, checkStatus };
    };

    function createGameController(size, symbols) {
        let board = createGameboard(size);
        const players = Array()

        symbols.forEach(symbol => {
            let userName = prompt(`Player ${symbol}, what is your name?`);
            players.push(createPlayer(symbol, userName));
        });
         
        let activeI = 0;
        
        function evaluateMove(x, y) {
            [x, y].forEach(i => {
                if (!(Number.isInteger(i)) || i < 0 || i > (size - 1) ) {
                    throw new InvalidMoveFormatError();
                }
            })
        }

        function runRound() {
            let gameStatus = board.checkStatus();

            if (gameStatus === "continue") {
                console.table(board.getBoard());

                try {
                    let activePlayer = players[activeI]
                    let { symbol, x, y } = activePlayer.getMove();
                    
                    evaluateMove(x, y);
                    board.placeSymbol(symbol, x, y);
                    placeSymbolInBox(x, y, symbol);

                    if (activeI < (players.length - 1)) {
                        activeI++;
                    } else {
                        activeI = 0;
                    }
                    activePlayer = players[activeI];
                    gameStatus = board.checkStatus();

                    if (gameStatus != "continue") {
                        console.log("Game won by ", gameStatus);
                    }

                } catch (error) {
                    // Catch the error 
                    if (!(error instanceof InvalidMoveFormatError) && !(error instanceof InvalidMoveLocationError)) {
                        // Stop the game if an unknown error occur
                        gameStatus = "failed";
                    }
                    console.log("Error:", error.message);
                }
            } else {
                console.table(board.getBoard());
                console.log("Game won by ", gameStatus);
            }
        }

        function reset() {
            board = createGameboard(size);  // background reset
            emptyAllBoxes();                // foreground reset
        }

        return { runRound, reset };
    };

    return { createGameController }
}