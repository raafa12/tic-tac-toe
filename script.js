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

    // Function to place a token in the chosen cell
    const dropToken = (row, column, player) => {
        if (board[row][column].getValue() !== 0) {
            return false;
        }
        board[row][column].addToken(player);
        return true;
    };

    // Method to print the board
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => 
            row.map((cell) => cell.getValue())
        );
        console.log(boardWithCellValues);
    };  

    // Method to check if the board is full (draw)
    const isBoardFull = () => {
        return board.every(row => 
            row.every(cell => cell.getValue() !== 0)
        );
    };

    // Method to check for a winner
    const checkWinner = () => {
        const boardValues = board.map((row) => 
            row.map((cell) => cell.getValue())
        );

        // Check rows
        for (let i = 0; i < rows; i++) {
            if (boardValues[i][0] !== 0 && 
                boardValues[i][0] === boardValues[i][1] && 
                boardValues[i][1] === boardValues[i][2]) {
                return boardValues[i][0];
            }
        }

        // Check columns
        for (let j = 0; j < columns; j++) {
            if (boardValues[0][j] !== 0 && 
                boardValues[0][j] === boardValues[1][j] && 
                boardValues[1][j] === boardValues[2][j]) {
                return boardValues[0][j];
            }
        }

        // Check diagonals
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

        // Check for draw
        if (isBoardFull()) {
            return 'draw';
        }
        
        return null;
    };

    // Method to reset the board
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
const GameController = (playerOneName = "Player X", playerTwoName = "Player O") => {
    const players = [
        { name: playerOneName, token: 1 },
        { name: playerTwoName, token: 2 }
    ];

    const gameboard = Gameboard();
    let activePlayer = players[0];
    let gameOver = false;

    // Internal function 1: Switch active player
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    // Internal function 2: Get the active player
    const getActivePlayer = () => activePlayer;

    // Internal function 3: Play a round
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

    // Get the game state
    const isGameOver = () => gameOver;

    // Internal function 4: Reset the game
    const resetGame = () => {
        gameboard.resetBoard();
        activePlayer = players[0];
        gameOver = false;
    };

    return {
        playRound,
        getActivePlayer,
        getGameboard: gameboard.getBoard,
        resetGame,
        isGameOver
    };
};

// Wait for the DOM to be fully loaded before running the game setup
document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const playerForm = document.getElementById('playerForm');
    const gameContainer = document.getElementById('gameContainer');
    const messageDiv = document.querySelector('.message');
    const resetButton = document.querySelector('.reset-button');
    const changeNamesButton = document.querySelector('.change-names-button');
    const cells = document.querySelectorAll('.cell');
    
    // Player name inputs
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    const startGameButton = document.getElementById('startGame');
    
    // Game state
    let game;
    
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
    
    // Function to start the game with player names
    function startGame() {
        const player1Name = player1Input.value.trim() || "Player X";
        const player2Name = player2Input.value.trim() || "Player O";
        
        // Initialize game controller with player names
        game = GameController(player1Name, player2Name);
        
        // Hide form and show game board
        playerForm.style.display = 'none';
        gameContainer.style.display = 'flex';
        
        // Update the board display
        updateBoard();
    }
    
    // Update the board display based on game state
    function updateBoard() {
        const board = game.getGameboard();
        
        cells.forEach(cell => {
            const [row, col] = cellToCoordinates[cell.id];
            cell.textContent = tokenDisplay[board[row][col].getValue()];
        });
        
        // Update turn message if game is not over
        if (!game.isGameOver()) {
            messageDiv.textContent = `${game.getActivePlayer().name}'s turn`;
        }
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
                const winnerToken = winner === 1 ? "X" : "O";
                const winnerName = winner === 1 ? 
                    player1Input.value.trim() || "Player X" : 
                    player2Input.value.trim() || "Player O";
                messageDiv.textContent = `¡${winnerName} (${winnerToken}) gana!`;
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
            if (board[row][col].getValue() !== 0 || game.isGameOver()) {
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
    
    // Handle start game button
    startGameButton.addEventListener('click', startGame);
    
    // Handle reset button
    resetButton.addEventListener('click', () => {
        game.resetGame();
        updateBoard();
    });
    
    // Handle change names button
    changeNamesButton.addEventListener('click', () => {
        gameContainer.style.display = 'none';
        playerForm.style.display = 'block';
    });
});

