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

// Wait for the DOM to be fully loaded before running the game setup
document.addEventListener('DOMContentLoaded', () => {
    // Get all cell elements
    const cells = document.querySelectorAll('.cell');
    
    // Create message element if it doesn't exist
    let messageDiv = document.querySelector('.message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        document.querySelector('.main-section').appendChild(messageDiv);
    }
    
    // Create reset button if it doesn't exist
    let resetButton = document.querySelector('.reset-button');
    if (!resetButton) {
        resetButton = document.createElement('button');
        resetButton.textContent = 'New Game';
        resetButton.className = 'reset-button';
        document.querySelector('.main-section').appendChild(resetButton);
    }
    
    // Initialize game with the original GameController
    const game = GameController("Player X", "Player O");
    
    // Map cell IDs to board coordinates
    const cellToCoordinates = {
        'cell1': [0, 0], 'cell2': [0, 1], 'cell3': [0, 2],
        'cell4': [1, 0], 'cell5': [1, 1], 'cell6': [1, 2], 
        'cell7': [2, 0], 'cell8': [2, 1], 'cell9': [2, 2]
    };
    
    // Tokens to display characters
    const tokenDisplay = {
        0: '',
        1: 'X',
        2: 'O'
    };
    
    // Update the board display based on game state
    function updateBoard() {
        const board = game.getGameboard();
        
        cells.forEach(cell => {
            const [row, col] = cellToCoordinates[cell.id];
            cell.textContent = tokenDisplay[board[row][col].getValue()];
        });
        
        // Update turn message
        messageDiv.textContent = `${game.getActivePlayer().name}'s turn`;
    }
    
    // Check if the game is over after a move
    function checkGameStatus() {
        const board = game.getGameboard();
        const gameBoard = Gameboard(); // Create a temporary board to check winner
        
        // Copy current game state to the temporary board
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j].getValue() !== 0) {
                    gameBoard.dropToken(i, j, board[i][j].getValue());
                }
            }
        }
        
        const winner = gameBoard.checkWinner();
        
        if (winner) {
            if (winner === 'draw') {
                messageDiv.textContent = "¡Es un empate!";
                return true;
            } else {
                const winnerName = winner === 1 ? "Player X" : "Player O";
                messageDiv.textContent = `¡${winnerName} gana!`;
                return true;
            }
        }
        
        return false;
    }
    
    // Handle cell clicks
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            // Get coordinates from cell ID
            const [row, col] = cellToCoordinates[cell.id];
            const board = game.getGameboard();
            
            // Check if the cell is already taken or if game is over
            if (board[row][col].getValue() !== 0 || checkGameStatus()) {
                return;
            }
            
            // Make the move
            game.playRound(row, col);
            
            // Update the board display
            updateBoard();
            
            // Check if the game is over after this move
            checkGameStatus();
        });
    });
    
    // Handle reset button
    resetButton.addEventListener('click', () => {
        game.resetGame();
        updateBoard();
    });
    
    // Initialize the board display
    updateBoard();
});


