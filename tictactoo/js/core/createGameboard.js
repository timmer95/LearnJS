import { InvalidMoveLocationError } from "../errors.js";

export function createGameboard(size) {
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
                throw new InvalidMoveLocationError(`You cannot place at (${x}, ${y}), it is occupied`);
            };
            return true;
        }

        function getBoard() {
            return _board
        }

        function checkStatus() {
            const winners = [ checkRows(), checkCols(), checkDiagonal1(), checkDiagonal2() ];
            let result = 'nobody';
            winners.forEach(winner => {
                if (winner != "nobody") {
                    result = winner;
                }
            })    
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

        return { getBoard, placeSymbol, checkStatus, isBoardFull };
    };