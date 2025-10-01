function createPlayer(symbol, name) {
    
    function getMove() {
        const moveFullString = prompt(`${name}, what will be your next move? (x, y) 0-based index`);
        // let moveFullString = "1 2"
        const [ xString, yString ] = moveFullString.split(" ");
        const x = Number(xString);
        const y = Number(yString);

        return { symbol, x, y }
    }

    alert(`Created player ${symbol} for ${name}`)

    return {name, getMove};
}

function createGameboard(size) {
    let _board = Array(size);
    let i = 0
    while (i < size) {
        _board[i] = Array(size).fill('')
        i ++;
    }

    function placeSymbol(symbol, x, y) {
        if (_board[y][x] == "") {
            _board[y][x] = symbol
        } else {
            throw new Error(`You cannot place ${symbol} at (${x}, ${y}), it is occupied`)
        }
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
        return result;

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
}

function createGameController(size, symbols) {
    let board = createGameboard(size);
    let players = Array()

    symbols.forEach(symbol => {
        let userName = prompt(`Player ${symbol}, what is your name?`);
        players.push(createPlayer(symbol, userName));
    });


    function run() {
        let activeI = 0;
        let gameStatus = board.checkStatus();

        while (gameStatus === "continue") {
            console.table(board.getBoard());
            let activePlayer = players[activeI]
            let { symbol, x, y } = activePlayer.getMove();

            try {
                board.placeSymbol(symbol, x, y);

            if (activeI < (players.length - 1)) {
                activeI++;
            } else {
                activeI = 0;
            }
            activePlayer = players[activeI]
            gameStatus = board.checkStatus();
            } catch (error) {
                console.log("Error:", error.message)
            }
            
        }

        console.table(board.getBoard());
        console.log("Game won by ", gameStatus);
        
        
    }

    return {run}


}

const game = createGameController(3, ["X", "O"]);
game.run();