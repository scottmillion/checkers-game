const legalSquares = [
  1, 3, 5, 7, 10, 12, 14, 16, 17, 19, 21, 23, 26, 28, 30, 32, 33,
  35, 37, 39, 42, 44, 46, 48, 49, 51, 53, 55, 58, 60, 62, 64
];
let currentPlayer, selectedPiece, additionalAttackOption, player1, player2;

// =================================================
// ============== GAME INITIALIZATION ==============
// =================================================

function initializeBoardSquares() {
  for (let i = 64; i > 0; i--) {
    // CREATE & ADD DIV ELEMENTS FOR SQUARES AND ASSIGN CLASSES, ID ATTRITBUTES
    let element = document.createElement("div");
    element.setAttribute("id", `n${i}`);
    element.classList.add("square");
    legalSquares.indexOf(i) >= 0 ? element.classList.add("darkSquare", "legalSquare")
      : element.classList.add("lightSquare");
    document.getElementById("board").appendChild(element);

    // ANY CLICKS WILL TRIGGER THE CONTROLLER
    element.addEventListener("click", (e) => {
      playerTurnAction(currentPlayer, element, i);
    });

  }
}

function initializePlayers() {
  // CREATE TWO PLAYER INSTANCES
  function Player(name, squares) {
    this.name = name;
    this.squares = squares;

  }
  return [
    new Player('player1', [1, 3, 5, 7, 10, 12, 14, 16, 17, 19, 21, 23]), 
    new Player('player2', [42, 44, 46, 48, 49, 51, 53, 55, 58, 60, 62, 64])
  ];
  
}

function initializePlayerColorAndPieceClasses(player1, player2) {
  // ADD A COLOR PROPERTY TO EACH PLAYER
  // ADD A CSS CLASS PROPERTY TO STYLE THEIR PIECES
  let color = ["white", "black"];
  let pieceClasses = [Array(12).fill('white-pawn'), Array(12).fill('black-pawn')];
  let randomIndex = [Math.floor(Math.random() * 2)];
  [player1.color, player1.pieceClasses] = [color.splice(randomIndex, 1)[0], pieceClasses.splice(randomIndex, 1)[0]];
  [player2.color, player2.pieceClasses] = [color[0], pieceClasses[0]];

  // ADD CSS CLASS TO PLAYER OCCUPIED SQUARES TO SHOW PLAYER PIECES
  for (let i = 0; i < 12; i++) {
    document.getElementById(`n${player1.squares[i]}`).classList.add(player1.pieceClasses[i]);
    document.getElementById(`n${player2.squares[i]}`).classList.add(player2.pieceClasses[i]);
  }
}

// =================================================
// =========== NON MOVE-ATTACK FUNCTIONS ===========
// =================================================

function playerSwap(player) {
  return player.name === "player2" ? player1 : player2;
}

function removeActiveSquareClassFromAllSquares() {
  document.querySelectorAll(".legalSquare").forEach((square) => { square.classList.remove("active-square"); });
}

function emptySquare(squareNum) {
  return !player1.squares.includes(squareNum) && !player2.squares.includes(squareNum) && legalSquares.includes(squareNum);
}

function startGame() {
  initializeBoardSquares();
  [player1, player2]     = initializePlayers();
  initializePlayerColorAndPieceClasses(player1, player2)
  currentPlayer          = player1.color === 'white' ? player1 : player2;
  selectedPiece          = null;
  additionalAttackOption = false;
}

function passTurn() {
  selectedPiece = null;
  additionalAttackOption = false;
  currentPlayer = playerSwap(currentPlayer);
  console.log("----------------------------");
  console.log(currentPlayer.name);
  console.log(currentPlayer.color);
  console.log("legal moves? " + areThereAnyLegalMoves(currentPlayer));
  console.log("legal attacks? " + areThereAnyLegalAttacks(currentPlayer, playerSwap(currentPlayer)));
  console.log("Game Over? " + !((areThereAnyLegalMoves(currentPlayer)) || areThereAnyLegalAttacks(currentPlayer, playerSwap(currentPlayer))));
  console.log("----------------------------");
}

// =================================================
// =============== KING ME FUNCTIONS ===============
// =================================================

function kingMe(player, newLocation, nextSquare, color) {
  let kingIndex    = player.squares.indexOf(newLocation);
  let currentClass = player.pieceClasses[kingIndex];
  let newClass     = color === "white" ? "white-piece-king" : "black-piece-king";
  nextSquare.classList.remove(currentClass);
  nextSquare.classList.add(newClass);
  player.pieceClasses[kingIndex] = newClass;
}

function kingMeMaybe(player, newLocation, nextSquare) {
  let player1KingIndex = [58, 60, 62, 64].indexOf(newLocation);
  let player2KingIndex = [1, 3, 5, 7].indexOf(newLocation);
  if (player === player1 && player1KingIndex >= 0) { kingMe(player, newLocation, nextSquare, player.color); }
  if (player === player2 && player2KingIndex >= 0) { kingMe(player, newLocation, nextSquare, player.color); }
}

// =================================================
// ====== IS IT A LEGAL MOVE/ATTACK FUNCTIONS ======
// =================================================
function isLegalMove(player, squareNum) {
  let currentClass = player.pieceClasses[player.squares.indexOf(selectedPiece)];
  let downMove     = (selectedPiece - 7 === squareNum || selectedPiece - 9 === squareNum) && emptySquare(squareNum);
  let upMove       = (selectedPiece + 7 === squareNum || selectedPiece + 9 === squareNum) && emptySquare(squareNum);

  if (currentClass === "black-piece-king" || currentClass === "white-piece-king") { return downMove || upMove; }
  if (player === player1) { return upMove; }
  if (player === player2) { return downMove; }
  console.log("******err at isLegalMove******");
  return false;
}

function areThereAnyLegalMoves(player) {
  let result = false;
  for (let i = 0; i < player.squares.length; i++) {
    let squareNum    = player.squares[i];
    let currentClass = player.pieceClasses[i];
    let isDownMove   = emptySquare(squareNum - 7) || emptySquare(squareNum - 9);
    let isUpMove     = emptySquare(squareNum + 7) || emptySquare(squareNum + 9);

    if (currentClass === "black-piece-king" || currentClass === "white-piece-king" && (isDownMove || isUpMove)) { result = true; }
    if (player === player1 && isUpMove)   { result = true; }
    if (player === player2 && isDownMove) { result = true; }
  }
  return result;
}

function isLegalAttack(player, opponent, squareNum) {
  // CHECK MATH PREVtoNEXT SQUARE, IF JUMPED SQUARE HAS OPPONENT, IF NEXT SQUARE IS UNOCCUPIED.
  let currentClass = player.pieceClasses[player.squares.indexOf(selectedPiece)];
  let upAttack1    = selectedPiece + 18 === squareNum && opponent.squares.includes(selectedPiece + 9) && emptySquare(squareNum);
  let upAttack2    = selectedPiece + 14 === squareNum && opponent.squares.includes(selectedPiece + 7) && emptySquare(squareNum);
  let downAttack1  = selectedPiece - 18 === squareNum && opponent.squares.includes(selectedPiece - 9) && emptySquare(squareNum);
  let downAttack2  = selectedPiece - 14 === squareNum && opponent.squares.includes(selectedPiece - 7) && emptySquare(squareNum);
  let anyAttack    = upAttack1 || upAttack2 || downAttack1 || downAttack2;

  if (currentClass === "black-piece-king" || currentClass === "white-piece-king") { return anyAttack; }
  if (player === player1) { return upAttack1 || upAttack2; }
  if (player === player2) { return downAttack1 || downAttack2; }

  console.log('******err at isLegalAttack******');
  return false;
}

function isThereALegalAttack(player, opponent, tempSelected) {
  let currentClass = player.pieceClasses[player.squares.indexOf(tempSelected)];
  let isUpRight    = emptySquare(tempSelected + 18) && opponent.squares.includes(tempSelected + 9);
  let isUpLeft     = emptySquare(tempSelected + 14) && opponent.squares.includes(tempSelected + 7);
  let isDownRight  = emptySquare(tempSelected - 14) && opponent.squares.includes(tempSelected - 7);
  let isDownLeft   = emptySquare(tempSelected - 18) && opponent.squares.includes(tempSelected - 9);
  let isAtLeastOne = isUpRight || isUpLeft || isDownLeft || isDownRight;

  if (currentClass === "black-piece-king" || currentClass === "white-piece-king") { return isAtLeastOne; }
  if (player === player1) { return isUpRight || isUpLeft; }
  if (player === player2) { return isDownRight || isDownLeft; }

  console.log('******err in isThereALegalAttack******');
  return false;
}

function areThereAnyLegalAttacks(player, opponent) {
  let result = false;
  player.squares.forEach((squareNum) => {
    if (isThereALegalAttack(player, opponent, squareNum)) { result = true; }
  })
  return result;
}

// =================================================
// ============ MOVE / ATTACK FUNCTIONS ============
// =================================================

function completeMove(prevSquare, nextSquare, player, squareNum) {
  // MOVE YOUR PIECE TO NEW SQUARE, REMOVE OLD PIECE
  let squareIndex       = player.squares.indexOf(selectedPiece);
  let currentPieceClass = player.pieceClasses[squareIndex];
  let newLocation       = player.squares[squareIndex] = squareNum;
  
  prevSquare.classList.remove(currentPieceClass);
  nextSquare.classList.add(currentPieceClass); 
  kingMeMaybe(player, newLocation, nextSquare);
  return newLocation;
}

function removeJumpedPiece(opponent, squareNum) {
  let opponentPosition = squareNum + ((selectedPiece - squareNum) / 2);
  let removeIndex      = [opponent.squares.indexOf(opponentPosition)];
  document.getElementById('n' + opponentPosition).classList.remove(opponent.pieceClasses[removeIndex]);
  opponent.squares.splice(removeIndex, 1);
  opponent.pieceClasses.splice(removeIndex, 1);
}

function jumpPiece(player, squareNum, opponent, prevSquare, nextSquare) {
  let tempSelected = completeMove(prevSquare, nextSquare, player, squareNum);
  removeJumpedPiece(opponent, squareNum);
  if (!isThereALegalAttack(player, opponent, tempSelected)) {
    passTurn();
  } else {
    nextSquare.classList.add("active-square");
    selectedPiece = tempSelected;
    additionalAttackOption = true;

    setTimeout(function () {
      let answer = window.prompt("It's still your turn because a ***second*** jump is possible with your current piece. If DO NOT want to make the second jump type 'pass'. Otherwise, type 'ok' or press Enter.");
      if (answer === 'pass') {
        nextSquare.classList.remove("active-square");
        passTurn()
      }
    }, 100);
  }
}

// =================================================
// ================== CONTROLLER ===================
// =================================================

function playerTurnAction(player, square, squareNum) {
  // CONTROLLER EXECUTES WHENEVER A PLAYER CLICKS ON A SQUARE (SEE EVENT LISTENER IN initializeBoardSquares())
  let opponent    = playerSwap(player);
  let prevSquare  = document.getElementById('n' + selectedPiece);
  let nextSquare  = square;
  let squareOwner = player.squares.includes(selectedPiece);
  let preMoveReq  = squareOwner && legalSquares.includes(squareNum);

  if (!additionalAttackOption) {
    removeActiveSquareClassFromAllSquares();
    if (preMoveReq && isLegalAttack(player, opponent, squareNum)) {
      jumpPiece(player, squareNum, opponent, prevSquare, nextSquare);
    } else if (preMoveReq && isLegalMove(player, squareNum)) {
      completeMove(prevSquare, nextSquare, player, squareNum);
      passTurn();
    } else if (selectedPiece === squareNum) {
      // YOUR PIECE SQUARE IS HIGHLIGHTED AND YOU CLICK ON IT AGAIN
      nextSquare.classList.remove("active-square");
      selectedPiece = null;
    } else if (player.squares.includes(squareNum)) {
      // YOU CLICK ON A SQUARE WITH YOUR PIECE FOR THE FIRST TIME
      selectedPiece = squareNum;
      nextSquare.classList.add("active-square");
    } else {
      selectedPiece = null;
    }
  } else {
    if (preMoveReq && isLegalAttack(player, opponent, squareNum)) {
      removeActiveSquareClassFromAllSquares();
      jumpPiece(player, squareNum, opponent, prevSquare, nextSquare);
    }
  }
  //LOGS FOR ALL BOARDS SQUARE CLICKS
  console.log("squareNum: " + squareNum);
  console.log("selectedPiece: " + selectedPiece);
}


// =================================================
// ============== ACTION STARTS HERE ===============
// =================================================
startGame();