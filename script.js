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
  };

//Método para imprimir el tablero 
const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
    console.log(boardWithCellValues);
  };
  
  //Devuelve un objeto con los métodos públicos que podemos usar fuera de la función
  //principal del tablero. Sigue el patron modulo para encapsular la logica del juego
  return { getBoard, dropToken, printBoard };

