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

function playerSwap(player) {
  return player.name === "player2" ? player1 : player2;
}

function emptySquare(squareNum) {
  return !player1.squares.includes(squareNum) && !player2.squares.includes(squareNum);
}

function legalMove(currentPlayer, opponent, squareNum) {
  if (currentPlayer.name === "player2") {
    return (selectedPiece - 7 === squareNum || selectedPiece - 9 === squareNum) && emptySquare(squareNum);
  }
  return (selectedPiece + 7 === squareNum || selectedPiece + 9 === squareNum) && emptySquare(squareNum);
}

function legalAttack(player, squareNum) {
  // CHECK PREV SQUARE TO NEXT SQUARE JUMP MATH, IF MIDDLE SQUARE HAS OPPONENT, IF NEXT SQUARE IS UNOCCUPIED.
  let p1DiagAttack1 = selectedPiece + 18 === squareNum && player2.squares.includes(selectedPiece + 9) && emptySquare(squareNum);
  let p1DiagAttack2 = selectedPiece + 14 === squareNum && player2.squares.includes(selectedPiece + 7) && emptySquare(squareNum);
  let p2DiagAttack1 = selectedPiece - 18 === squareNum && player1.squares.includes(selectedPiece - 9) && emptySquare(squareNum);
  let p2DiagAttack2 = selectedPiece - 14 === squareNum && player1.squares.includes(selectedPiece - 7) && emptySquare(squareNum);
  if (player.name === "player1" && (p1DiagAttack1 || p1DiagAttack2)) { return true; }
  if (player.name === "player2" && (p2DiagAttack1 || p2DiagAttack2)) { return true; }
  return false;
}

function completeMove(prevSquare, nextSquare, player, i) {
  prevSquare.classList.remove(player.pieceClass);
  nextSquare.classList.add(player.pieceClass);
  player.squares[player.squares.indexOf(selectedPiece)] = i;
}

function passTurn() {
  selectedPiece = null;
  currentPlayer = playerSwap(currentPlayer);
}

function attemptMove(player, element, i) {
  let opponent = player === player1 ? player2 : player1;
  let prevSquare = document.getElementById('n' + selectedPiece);
  let nextSquare = document.getElementById('n' + i);
  let squareOwner = player.squares.includes(selectedPiece);

  if (squareOwner && legalMove(player, opponent, i) && legalSquares.includes(i)) {
    // IF YOU TRY TO MOVE ONE POSITION
    completeMove(prevSquare, nextSquare, player, i);
    passTurn();

  } else if (squareOwner && legalAttack(player, i) && legalSquares.includes(i)) {
    // IF YOU TRY TO SINGLE JUMP ANOTHER PIECE
    console.log(selectedPiece);
    completeMove(prevSquare, nextSquare, player, i);

    let opponentLosesPiecePosition1 = (selectedPiece - Math.abs(selectedPiece - i) / 2);
    let opponentLosesPiecePosition2 = (selectedPiece + Math.abs(selectedPiece - i) / 2);
    if (currentPlayer === player2) {
      console.log("player2 true", i);
      document.getElementById('n' + opponentLosesPiecePosition1).classList.remove(opponent.pieceClass);
      opponent.squares.splice([opponent.squares.indexOf(opponentLosesPiecePosition1)], 1);
    } else {
      console.log("player1 true", i);
      document.getElementById('n' + opponentLosesPiecePosition2).classList.remove(opponent.pieceClass);
      opponent.squares.splice([opponent.squares.indexOf(opponentLosesPiecePosition2)], 1);
    }
    console.log(player.squares);
    console.log(opponent.squares);
    passTurn();
  } else if (selectedPiece === i) {
    // YOUR PIECE IS HIGHLIGHTED AND YOU CLICK ON YOUR PIECE A SECOND TIME
    // REMOVE HIGHLIGHT AND REST selectedPiece
    element.classList.remove("active-square");
    selectedPiece = null;

  } else if (player.squares.includes(i)) {
    // IF YOU CLICK ON A SQUARE WITH YOUR PIECE
    // SET selectedPiece PIECE AND HIGHLIGHT
    selectedPiece = i;
    console.log(selectedPiece);
    element.classList.toggle("active-square");
  } else if (legalSquares.includes(i)) {
    // IF YOU CLICK ON A LEGAL SQUARE THAT DOESN'T CONTAIN YOUR PIECE
    // REMOVE HIGHLIGHT AND RESET selectedPiece
    console.log(i);
    selectedPiece = null;
    element.classList.remove("active-square");
  } else {
    selectedPiece = null;
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




