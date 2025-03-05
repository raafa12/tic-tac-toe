//Función para crear un tablero de 3x3
function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];
    //Crea las filas
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        //Llena cada fila con celdas individuales
        for (let j = 0; j < columns; j++) {
          board[i].push(Cell());
        }
    }
}

//Función para acceder al tablero 
const getBoard = () => board;

//Función para colocar una ficha en la fila elegida
const dropToken = (row, column, player) => {
    if (board[row][column].getValue() !== 0) {
        console.log("Celda ocupada, elige otra.");
        return;
    }
    board[row][column].addToken(player);
  };

//Método para imprimir el tablero 
const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
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
    const boardValues = board.map((row) => row.map((cell) => cell.getValue()));

    // Verificar filas
    for (let i = 0; i < rows; i++) {
        if (boardValues[i][0] !== 0 && boardValues[i][0] === boardValues[i][1] && boardValues[i][1] === boardValues[i][2]) {
            return boardValues[i][0];
        }
    }

    // Verificar columnas
    for (let j = 0; j < columns; j++) {
        if (boardValues[0][j] !== 0 && boardValues[0][j] === boardValues[1][j] && boardValues[1][j] === boardValues[2][j]) {
            return boardValues[0][j];
        }
    }

    // Verificar diagonales
    if (boardValues[0][0] !== 0 && boardValues[0][0] === boardValues[1][1] && boardValues[1][1] === boardValues[2][2]) {
        return boardValues[0][0];
    }
    if (boardValues[0][2] !== 0 && boardValues[0][2] === boardValues[1][1] && boardValues[1][1] === boardValues[2][0]) {
        return boardValues[0][2];
    }

    // Verificar empate
    if (isBoardFull()) {
        return 'draw';
    }
    
    return null; // No hay ganador aún
    };

//Devuelve un objeto con los métodos públicos que podemos usar fuera de la función
//principal del tablero. Sigue el patron modulo para encapsular la logica del juego
return { getBoard, dropToken, printBoard, checkWinner };

//Función para crear una celda con dos métodos: colocar una ficha o consultar el 
//valor de la celda
function Cell() {
    let value = 0;
    const addToken = (player) => {
      value = player;
    };
    const getValue = () => value;

    return {
        addToken,
        getValue
    };
  }



