const legalSquares = [1, 3, 5, 7, 10, 12, 14, 16, 17, 19, 21, 23, 26, 28, 30, 32, 33, 35, 37, 39, 42, 44, 46, 48, 49, 51, 53, 55, 58, 60, 62, 64];

let currentPlayer;
let selectedPiece;

function initializePlayers() {
  // CREATE TWO PLAYER OBJECT INSTANCES
  function Player(name, squares) {
    this.name = name;
    this.squares = squares;
  }
  player1 = new Player('player1', [1, 3, 5, 7, 10, 12, 14, 16, 17, 19, 21, 23]);
  player2 = new Player('player2', [42, 44, 46, 48, 49, 51, 53, 55, 58, 60, 62, 64]);
}

function initializePlayerColor(player1, player2) {
  // ADD A COLOR PROPERTY TO EACH PLAYER
  // ADD A CSS CLASS PROPERTY TO STYLE THEIR PIECES
  let color = ["white", "black"];
  let piecesClass = ["white-piece", "black-piece"];
  let randomIndex = [Math.floor(Math.random() * 2)];
  [player1.color, player1.pieceClass] = [color.splice(randomIndex, 1)[0], piecesClass.splice(randomIndex, 1)[0]];
  [player2.color, player2.pieceClass] = [color[0], piecesClass[0]];
}

function initializePlayerPieces(player) {
  // ADD CSS CLASS TO PLAYER OCCUPIED SQUARES TO SHOW PLAYER PIECES
  player.squares.forEach((num) => {
    document.getElementById(`n${num}`).classList.add(player.pieceClass);
  });
}

function legalMove(currentPlayer, opponent, squareNum) {
  if (currentPlayer.name === "player2") {
    return (selectedPiece - 7 === squareNum || selectedPiece - 9 === squareNum) && !currentPlayer.squares.includes(squareNum) && !opponent.squares.includes(squareNum);
  }
  return (selectedPiece + 7 === squareNum || selectedPiece + 9 === squareNum) && !currentPlayer.squares.includes(squareNum) && !opponent.squares.includes(squareNum);
}

function legalAttack(player, squareNum) {
  if (player.name === "player2") {
    return (selectedPiece - 18 === squareNum || selectedPiece - 14 === squareNum) && (player1.squares.includes(selectedPiece - 9) || player1.squares.includes(selectedPiece - 7));
  }
  return (selectedPiece + 18 === squareNum || selectedPiece + 14 === squareNum) && (player2.squares.includes(selectedPiece + 9) || player2.squares.includes(selectedPiece + 7));
}

function playerSwap(player) {
  return player.name === "player2" ? player1 : player2;
}

function attemptMove(player, element, i) {
  let opponent = player === player1 ? player2 : player1;
  let currentSquare = document.getElementById('n' + selectedPiece);
  let newSquare = document.getElementById('n' + i);
  let squareOwner = player.squares.includes(selectedPiece);

  if (squareOwner && legalMove(player, opponent, i)) {
    currentSquare.classList.remove(player.pieceClass);
    newSquare.classList.add(player.pieceClass);
    player.squares[player.squares.indexOf(selectedPiece)] = i;
    selectedPiece = null;
    currentPlayer = playerSwap(currentPlayer);

  } else if (squareOwner && legalAttack(player, i)) {
    console.log("here")
    console.log(selectedPiece);
    currentSquare.classList.remove(player.pieceClass);
    newSquare.classList.add(player.pieceClass);
    player.squares[player.squares.indexOf(selectedPiece)] = i;

    let opponentLosesPiecePosition1 = (selectedPiece - Math.abs(selectedPiece - i) / 2);
    let opponentLosesPiecePosition2 = (selectedPiece + Math.abs(selectedPiece - i) / 2);
    if (currentPlayer === player2) {
      console.log("player2 true");
      console.log(i);
      document.getElementById('n' + opponentLosesPiecePosition1).classList.remove(opponent.pieceClass);
      opponent.squares.splice([opponent.squares.indexOf(opponentLosesPiecePosition1)], 1);
    } else {
      console.log("player1 true")
      console.log(i);
      document.getElementById('n' + opponentLosesPiecePosition2).classList.remove(opponent.pieceClass);
      opponent.squares.splice([opponent.squares.indexOf(opponentLosesPiecePosition2)], 1);
    }
    console.log(player.squares);
    console.log(opponent.squares);
    selectedPiece = null;
    currentPlayer = playerSwap(currentPlayer);
  } else if (legalSquares.includes(i)) {
    selectedPiece = i;
    console.log(selectedPiece);
    element.classList.toggle("active-square");
  }
}

function initializeBoardSquares() {
  for (let i = 64; i > 0; i--) {
    // CREATE & ADD DIV ELEMENTS FOR SQUARES AND ASSIGN CLASSES, ID ATTRITBUTE
    let element = document.createElement("div");
    element.classList.add("square");
    if (legalSquares.indexOf(i) >= 0) {
      element.classList.add("darkSquare", "legalSquare");
    } else {
      element.classList.add("lightSquare");
    }
    element.setAttribute("id", `n${i}`);
    document.getElementById("board").appendChild(element);

    // ADD EVENT LISTENERS
    element.addEventListener("click", (e) => {
      document.querySelectorAll(".legalSquare").forEach((square) => {
        square.classList.remove("active-square");
      });
      attemptMove(currentPlayer, element, i);
    });

  }
}



function playGame() {
  currentPlayer = player1.color === 'white' ? player1 : player2;
  console.log("Current Player")
  console.log(currentPlayer.name);
}



initializeBoardSquares();
initializePlayers();
initializePlayerColor(player1, player2);
initializePlayerPieces(player1);
initializePlayerPieces(player2);

playGame();






// GAME OF CHECKERS

// ===START SETUP===
// DETERMINE WHO GOES FIRST
// PLACE BOARD AND PIECES
  // WHITE GOES FIRST  
  // BLACK GOES 2ND
// ===END SETUP===

// ===START GAME LOOP===
  // CHECK IF CurrentPlayer CAN MOVE A PIECE
    // IF NOT, GAME OVER. STALEMATE.
  // CurrentPlayer single clicks on a piece, activating CurrentPiece
    // Is piece 'Kinged'? Then use King logic.
  // CurrentPlayer clicks on a square
    // IF (LegalMove, PieceType)
      // Move piece to new square.
    // ELSE IF (LegalAttack, PieceType)
      // Move piece to new square. Remove jumped piece.  
  // Check if piece is in kingSquares
    // IF not Kinged, King.
  // Check if OtherPlayer has any pieces
    // if not, game over.
  // Switch Players
// ===END GAME LOOP===




