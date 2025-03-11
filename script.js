// Factory function for creating a cell
const Cell = () => {
    let value = 0;
    
    const addToken = (player) => {
      value = player;
    };
    const getValue = () => value;

    const reset = () => {
        value = 0;
    };

    return { addToken, getValue, reset };
}

// Factory function for creating the game board
const Gameboard = () => {
    const rows = 3;
    const columns = 3;
    const board = [];
    
    // Initialize the board
    const initializeBoard = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }
    };

    // Initial board creation
    initializeBoard();

    const getBoard = () => board;

    //Función para colocar una ficha en la fila elegida
    const dropToken = (row, column, player) => {
        if (board[row][column].getValue() !== 0) {
            return false;
        }
        board[row][column].addToken(player);
        return true;
    };


    //Método para imprimir el tablero 
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => 
            row.map((cell) => cell.getValue())
        );
        console.log(boardWithCellValues);
    };  

    //Método para ver si el tablero esta lleno (empate)
    const isBoardFull = () => {
        return board.every(row => 
            row.every(cell => cell.getValue() !== 0)
        );
    };

    //Método para verificar ganador
    const checkWinner = () => {
        const boardValues = board.map((row) => 
            row.map((cell) => cell.getValue())
        );

        // Verificar filas
        for (let i = 0; i < rows; i++) {
            if (boardValues[i][0] !== 0 && 
                boardValues[i][0] === boardValues[i][1] && 
                boardValues[i][1] === boardValues[i][2]) {
                return boardValues[i][0];
            }
        }

        // Verificar columnas
        for (let j = 0; j < columns; j++) {
            if (boardValues[0][j] !== 0 && 
                boardValues[0][j] === boardValues[1][j] && 
                boardValues[1][j] === boardValues[2][j]) {
                return boardValues[0][j];
            }
        }

        // Verificar diagonales
        if (boardValues[0][0] !== 0 && 
            boardValues[0][0] === boardValues[1][1] && 
            boardValues[1][1] === boardValues[2][2]) {
            return boardValues[0][0];
        }
        
        if (boardValues[0][2] !== 0 && 
            boardValues[0][2] === boardValues[1][1] && 
            boardValues[1][1] === boardValues[2][0]) {
            return boardValues[0][2];
        }

        // Verificar empate
        if (isBoardFull()) {
            return 'draw';
        }
        
        return null;
        };

        // Método para reiniciar el tablero
        const resetBoard = () => {
            board.forEach(row => 
                row.forEach(cell => cell.reset())
            );
        };
    
        return { 
            getBoard, 
            dropToken, 
            printBoard, 
            checkWinner, 
            resetBoard,
            isBoardFull 
        };
};

// Factory function for creating the game controller
const GameController = (playerOneName = "Player 1", playerTwoName = "Player 2") => {
    const players = [
        { name: playerOneName, token: 1 },
        { name: playerTwoName, token: 2 }
    ];

    const gameboard = Gameboard();
    let activePlayer = players[0];
    let gameOver = false;

    // Internal function 1
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    // Internal function 2
    const getActivePlayer = () => activePlayer;

    // Internal function 3
    const playRound = (row, column) => {
        if (gameOver) {
            console.log("Game is already over!");
            return;
        }

        const dropResult = gameboard.dropToken(row, column, activePlayer.token);
        
        if (!dropResult) {
            console.log("Invalid move. Try again.");
            return;
        }

        const winner = gameboard.checkWinner();
        
        if (winner) {
            gameOver = true;
            if (winner === 'draw') {
                console.log("It's a draw!");
            } else {
                const winningPlayer = players.find(player => player.token === winner);
                console.log(`${winningPlayer.name} wins!`);
            }
            return;
        }

        switchPlayerTurn();
    };

    // Internal function 4
    const resetGame = () => {
        gameboard.resetBoard();
        activePlayer = players[0];
        gameOver = false;
    };

    return {
        playRound,
        getActivePlayer,
        getGameboard: gameboard.getBoard,
        resetGame
    };
};


// Example usage
const game = GameController();

// Simulate a game
function simulateGame() {
    console.log("Starting game simulation:");
    
    // Moves that would result in a game
    const moves = [
        [0,0], [1,1], 
        [0,1], [1,0], 
        [0,2]
    ];

    moves.forEach((move, index) => {
        console.log(`\nRound ${index + 1}`);
        console.log(`Active player: ${game.getActivePlayer().name}`);
        game.playRound(move[0], move[1]);
        
        // Print board after each move
        const board = game.getGameboard();
        board.forEach(row => {
            console.log(row.map(cell => cell.getValue()));
        });
    });
}



