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
    let winner = null;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const playRound = (row, column) => {
        if (gameOver) {
            console.log("Game is already over!");
            return false;
        }

        const dropResult = gameboard.dropToken(row, column, activePlayer.token);
        
        if (!dropResult) {
            console.log("Invalid move. Try again.");
            return false;
        }

        winner = gameboard.checkWinner();
        
        if (winner) {
            gameOver = true;
            return true;
        }

        switchPlayerTurn();
        return true;
    };

    const resetGame = () => {
        gameboard.resetBoard();
        activePlayer = players[0];
        gameOver = false;
        winner = null;
    };

    // Getters for game status
    Object.defineProperties(this, {
        'isGameOver': {
            get: function() { return gameOver; }
        },
        'winner': {
            get: function() { return winner; }
        }
    });

    return {
        playRound,
        getActivePlayer,
        getGameboard: gameboard.getBoard,
        resetGame,
        get isGameOver() { return gameOver; },
        get winner() { return winner; }
    };
};



// Example usage
const game = GameController();

// This function sets up all the DOM interaction
function setupGame() {
    // Get DOM elements
    const cells = document.querySelectorAll('.cell');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    const resetButton = document.createElement('button');
    resetButton.textContent = 'New Game';
    resetButton.className = 'reset-button';
    
    // Add message and button to the DOM
    const mainSection = document.querySelector('.main-section');
    mainSection.appendChild(messageDiv);
    mainSection.appendChild(resetButton);
    
    // Initialize the game controller
    const game = GameController("Player X", "Player O");
    
    // Map DOM cell IDs to board coordinates
    const cellToCoordinates = {
        'cell1': [0, 0], 'cell2': [0, 1], 'cell3': [0, 2],
        'cell4': [1, 0], 'cell5': [1, 1], 'cell6': [1, 2], 
        'cell7': [2, 0], 'cell8': [2, 1], 'cell9': [2, 2]
    };
    
    // Map player tokens to display characters
    const tokenDisplay = {
        0: '',  // Empty cell
        1: 'X',  // Player 1
        2: 'O'   // Player 2
    };
    
    // Function to update the board display based on the game state
    function updateDisplay() {
        const board = game.getGameboard();
        
        // Update each cell with the correct token
        cells.forEach(cell => {
            const [row, col] = cellToCoordinates[cell.id];
            cell.textContent = tokenDisplay[board[row][col].getValue()];
        });
        
        // Update the message with the active player
        const activePlayer = game.getActivePlayer();
        messageDiv.textContent = `${activePlayer.name}'s turn`;
    }
    
    // Handle cell clicks
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            // Convert cell ID to board coordinates
            const [row, col] = cellToCoordinates[cell.id];
            
            // If the cell already has content, it's already taken
            if (cell.textContent !== '') {
                messageDiv.textContent = 'That spot is already taken!';
                return;
            }
            
            // Play a round
            const activePlayer = game.getActivePlayer();
            game.playRound(row, col);
            
            // Update the display
            updateDisplay();
            
            // Check for a winner or draw
            const winner = game.getGameboard()[row][col].getValue();
            if (game.isGameOver) {
                if (game.winner === 'draw') {
                    messageDiv.textContent = "It's a draw!";
                } else {
                    const winningPlayer = winner === 1 ? "Player X" : "Player O";
                    messageDiv.textContent = `${winningPlayer} wins!`;
                }
            }
        });
    });
    
    // Handle reset button click
    resetButton.addEventListener('click', () => {
        game.resetGame();
        updateDisplay();
        messageDiv.textContent = `${game.getActivePlayer().name}'s turn`;
    });
    
    // Initialize the display
    updateDisplay();
}


