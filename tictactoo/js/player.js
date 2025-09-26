function createPlayer(symbol, name) {
    
    function getMove() {
        const moveFullString = prompt(`${name}, what will be your next move? (x, y) 0-based index`);
        // let moveFullString = "1 2"
        const { xString, yString } = moveFullString.split(" ");
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
        winners.forEach(winner => {
            if (winner != null) {
                return winner
            }
        })     

    }

    function checkRows() {
        let winner = null;
        _board.forEach(row => {
            const { fullRow, player } = checkRow(row);
            if (fullRow) {
                winner = player;
            } 
        })
        return winner;

    }

    function checkRow(row) {
        let fullRow = true;
        const firstItem = row[0];
        row.forEach(item => {
            fullRow = item === firstItem;
        })
        return { fullRow, firstItem}
    }

    function checkCols() {
        let winner = null;
        for (let c = 0; c < size; c++) {
            let fullCol = true;
            const firstItem = _board[0][c]
            for (let r = 0; r < size; r++) {
                fullCol = _board[r][c] === firstItem; 
            }
            if (fullCol) {
                winner = player;
            }
        }
        return winner;

    }

    function checkDiagonal1() {
        let fullDiagonal = true;
        const firstItem = _board[0][0];
        for (let i = 0; i < size; i++) {
            fullDiagonal = _board[i][i] === firstItem;
        }
        const winner = fullDiagonal? firstItem : null;
        return winner;
    }

    function checkDiagonal2() {
        let fullDiagonal = true;
        const firstItem = _board[ size - 1 ][0];
        for (let i = 0; i < size; i++) {
            fullDiagonal = _board[ size - 1 - i][i] === firstItem;
        }
        const winner = fullDiagonal? firstItem : null;
        return winner;
    }



    return {getBoard, placeSymbol, checkStatus}
}

function createGameController(size, symbols) {
    let board = createGameboard(size);
    let players = Array()

    symbols.forEach(symbol => {
        let userName = prompt(`Player ${symbol}, what is your name?`);
        players.push(createPlayer(symbol, userName));
    });


    function run() {
        console.log(board.getBoard());
        let active_i = 0;
        const active_player = players[active_i]
        let { symbol, x, y } = active_player.getMove();
        board.placeSymbol(symbol, x, y);

        if (active_i < (players.length - 1)) {
            active_i ++;
        } else {
            active_i = 0;
        }
        
    }

    return {run}


}