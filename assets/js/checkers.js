const legalSquares = [1, 3, 5, 7, 10, 12, 14, 16, 17, 19, 21, 23, 26, 28, 30, 32, 33, 35, 37, 39, 42, 44, 46, 48, 49, 51, 53, 55, 58, 60, 62, 64];

const whitePieceSquares = [1, 3, 5, 7, 10, 12, 14, 16, 17, 19, 21, 23];
const blackPieceSquares = [42, 44, 46, 48, 49, 51, 53, 55, 58, 60, 62, 64];

function createBoardSquares() {
  for (let i = 64; i > 0; i--) {
    let element = document.createElement("div");
    element.classList.add("square");
    if (legalSquares.indexOf(i) >= 0) {
      element.classList.add("darkSquare");
      element.classList.add("legalSquare");
    } else {
      element.classList.add("lightSquare");
      element.classList.add("legalSquare");
    }
    element.setAttribute("id", `n${i}`);
    document.getElementById("board").appendChild(element);

    // ADD EVENT LISTENERS
    let selectedPiece;

    element.addEventListener("click", (e) => {
      document.querySelectorAll(".legalSquare").forEach((square) => {
        square.classList.remove("active-square");
      });
      if (legalSquares.includes(i)) {
        selectedPiece = i;
        console.log(selectedPiece);
        element.classList.toggle("active-square");
      }




      // click on a piece to select piece
      // get current location of piece
      // that piece square turns red
      // deselect piece by clicking again to turn off red
      // click on a square to move the piece
      // if that's a legal move
      // new square shows piece
      // piece location updated
      // old square blank
    });

  }
}

function placePieces(playerPieceSquares, bgImageClass) {
  playerPieceSquares.forEach((num) => {
    document.getElementById(`n${num}`).classList.add(bgImageClass);
  })
}

function initializeBoard() {
  createBoardSquares();
  placePieces(whitePieceSquares, "white-piece");
  placePieces(blackPieceSquares, "black-piece");
}

initializeBoard();


