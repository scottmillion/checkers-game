const legalSquares = [1, 3, 5, 7, 10, 12, 14, 16, 17, 19, 21, 23, 26, 28, 30, 32, 33, 35, 37, 39, 42, 44, 46, 48, 49, 51, 53, 55, 58, 60, 62, 64];

let currentPlayer;
let selectedPiece = null;
let awaitingSecondOptionalAttack = false;

function initializePlayers() {
  // CREATE TWO PLAYER OBJECT INSTANCES
  function Player(name, squares) {
    this.name = name;
    this.squares = squares;

  }
  // player1 = new Player('player1', [1, 3, 5, 7, 10, 12, 14, 16, 17, 19, 21, 23]);
  // player2 = new Player('player2', [42, 44, 46, 48, 49, 51, 53, 55, 58, 60, 62, 64]);
  player1 = new Player('player1', [49, 51, 53, 55]);
  player2 = new Player('player2', [10, 12, 14, 16]);
}

function initializePlayerColorAndPieceClasses(player1, player2) {
  // let whitePawns = ['white-pawn', 'white-pawn', 'white-pawn', 'white-pawn', 'white-pawn', 'white-pawn', 'white-pawn', 'white-pawn', 'white-pawn', 'white-pawn', 'white-pawn', 'white-pawn'];
  // let blackPawns = ['black-pawn', 'black-pawn', 'black-pawn', 'black-pawn', 'black-pawn', 'black-pawn', 'black-pawn', 'black-pawn', 'black-pawn', 'black-pawn', 'black-pawn', 'black-pawn'];
  let whitePawns = ['white-pawn', 'white-pawn', 'white-pawn', 'white-pawn'];
  let blackPawns = ['black-pawn', 'black-pawn', 'black-pawn', 'black-pawn'];

  // ADD A COLOR PROPERTY TO EACH PLAYER
  // ADD A CSS CLASS PROPERTY TO STYLE THEIR PIECES
  let color = ["white", "black"];
  let pieceClasses = [whitePawns, blackPawns];
  let randomIndex = [Math.floor(Math.random() * 2)];
  [player1.color, player1.pieceClasses] = [color.splice(randomIndex, 1)[0], pieceClasses.splice(randomIndex, 1)[0]];
  [player2.color, player2.pieceClasses] = [color[0], pieceClasses[0]];

  // ADD CSS CLASS TO PLAYER OCCUPIED SQUARES TO SHOW PLAYER PIECES
  for (let i = 0; i < whitePawns.length; i++) {
    document.getElementById(`n${player1.squares[i]}`).classList.add(player1.pieceClasses[i]);
    document.getElementById(`n${player2.squares[i]}`).classList.add(player2.pieceClasses[i]);
  }
}

function playerSwap(player) {
  return player.name === "player2" ? player1 : player2;
}

function emptySquare(squareNum) {
  return !player1.squares.includes(squareNum) && !player2.squares.includes(squareNum) && legalSquares.includes(squareNum);
}

function legalMove(player, squareNum) {
  let currentClass = player.pieceClasses[player.squares.indexOf(selectedPiece)];
  let downMove = (selectedPiece - 7 === squareNum || selectedPiece - 9 === squareNum) && emptySquare(squareNum);
  let upMove = (selectedPiece + 7 === squareNum || selectedPiece + 9 === squareNum) && emptySquare(squareNum);
  //KING PIECE
  if (currentClass === "black-piece-king" || currentClass === "white-piece-king") {
    console.log("true");
    return downMove || upMove;
  }
  //PLAYER 2 PIECE
  if (player === player2) { return downMove; }
  //PLAYER 1 PIECE
  return upMove;
}

function legalAttack(player, opponent, squareNum) {
  // CHECK MATH PREVtoNEXT SQUARE, IF JUMPED SQUARE HAS OPPONENT, IF NEXT SQUARE IS UNOCCUPIED.
  console.log("player at legal attack");
  console.log(player);
  let currentClass = player.pieceClasses[player.squares.indexOf(selectedPiece)];
  let upAttack1 = selectedPiece + 18 === squareNum && opponent.squares.includes(selectedPiece + 9);
  let upAttack2 = selectedPiece + 14 === squareNum && opponent.squares.includes(selectedPiece + 7);
  let downAttack1 = selectedPiece - 18 === squareNum && opponent.squares.includes(selectedPiece - 9);
  let downAttack2 = selectedPiece - 14 === squareNum && opponent.squares.includes(selectedPiece - 7);
  let anyAttack = upAttack1 || upAttack2 || downAttack1 || downAttack2;
  console.log("ttttttttttttttttttttttttttttttttttttttttttttttt");
  console.log(selectedPiece);
  console.log(squareNum);
  console.log(anyAttack);
  console.log(currentClass);
  console.log(emptySquare(squareNum));
  console.log("ttttttttttttttttttttttttttttttttttttttttttttttt");
  if (currentClass === "black-piece-king" || currentClass === "white-piece-king" && emptySquare(squareNum)) { return anyAttack; }
  if (player === player1 && emptySquare(squareNum)) { return upAttack1 || upAttack2; }
  if (player === player2 && emptySquare(squareNum)) { return downAttack1 || downAttack2; }

  console.log('******err at legalAttack******');
  return false;
}

function kingMe(player, newLocation, nextSquare, color) {
  console.log(player.name + " ****king me****");
  let colorClass = color === "white" ? "white-piece-king" : "black-piece-king";
  let currentClass = player.pieceClasses[player.squares.indexOf(newLocation)];
  nextSquare.classList.remove(currentClass);
  currentClass = colorClass;
  nextSquare.classList.add(currentClass);
  player.pieceClasses[player.squares.indexOf(newLocation)] = currentClass;


  console.log("-------=============--------");
  console.log(player.name + " squares:");
  console.log(player.squares);
  console.log(player.name + " pieceClasses:");
  console.log(player.pieceClasses);
  console.log("-------=============--------");
}

function kingMeMaybe(player, newLocation, nextSquare) {
  let player1KingIndex = [58, 60, 62, 64].indexOf(newLocation);
  let player2KingIndex = [1, 3, 5, 7].indexOf(newLocation);
  if (player === player1 && player1KingIndex >= 0) { kingMe(player, newLocation, nextSquare, player.color); }
  if (player === player2 && player2KingIndex >= 0) { kingMe(player, newLocation, nextSquare, player.color); }
}

function completeMove(prevSquare, nextSquare, player, i) {
  // MOVE YOUR PIECE TO NEW SQUARE, REMOVE OLD PIECE
  let currentPieceClass = player.pieceClasses[player.squares.indexOf(selectedPiece)];
  prevSquare.classList.remove(currentPieceClass);
  nextSquare.classList.add(currentPieceClass);
  let newLocation = player.squares[player.squares.indexOf(selectedPiece)] = i;
  kingMeMaybe(player, newLocation, nextSquare);
  return newLocation;
}

function removePiece(player, square) {
  let removeIndex = [player.squares.indexOf(square)];
  document.getElementById('n' + square).classList.remove(player.pieceClasses[removeIndex]);
  player.squares.splice(removeIndex, 1);
  player.pieceClasses.splice(removeIndex, 1);
}

function completeAttack(opponent, i) {
  // REMOVE OPPONENT JUMPED PIECE
  let opponentPosition = i + ((selectedPiece - i) / 2);
  removePiece(opponent, opponentPosition);
}

function passTurn() {
  selectedPiece = null;
  currentPlayer = playerSwap(currentPlayer);
  awaitingSecondOptionalAttack = false;

}

function anotherAttackAvailable(player, tempSelected) {
  if (player === player1) {
    let isEmptyOption1 = emptySquare(tempSelected + 18) && player2.squares.includes(tempSelected + 9);
    let isEmptyOption2 = emptySquare(tempSelected + 14) && player2.squares.includes(tempSelected + 7);
    return isEmptyOption1 || isEmptyOption2;
  }
  if (player === player2) {
    let isEmptyOption1 = emptySquare(tempSelected - 18) && player1.squares.includes(tempSelected - 9);
    let isEmptyOption2 = emptySquare(tempSelected - 14) && player1.squares.includes(tempSelected - 7);
    return isEmptyOption1 || isEmptyOption2;
  }
  console.log('error in anotherAttackAvailable');
  return false;
}

function firstAction(player, element, i, opponent, prevSquare, nextSquare, squareOwner) {
  document.querySelectorAll(".legalSquare").forEach((square) => {
    square.classList.remove("active-square");
  });
  if (squareOwner && legalMove(player, i) && legalSquares.includes(i)) {
    // MOVE A PIECE
    completeMove(prevSquare, nextSquare, player, i);
    passTurn();
  } else if (squareOwner && legalAttack(player, opponent, i) && legalSquares.includes(i)) {
    console.log("firstActionHere");
    // JUMP A PIECE
    let tempSelected = completeMove(prevSquare, nextSquare, player, i);
    completeAttack(opponent, i);
    if (!anotherAttackAvailable(player, tempSelected)) {
      console.log("No addition legal attacks available");
      passTurn();
    } else {
      console.log("Another legal attack is available");
      element.classList.add("active-square");
      selectedPiece = tempSelected;
      awaitingSecondOptionalAttack = true;
      setTimeout(function () {
        let answer = window.prompt("It's still your turn because a ***second*** jump is possible with your current piece. If DO NOT want to make the second jump type 'pass'. Otherwise, type 'ok' or press Enter.");
        if (answer === 'pass') {
          element.classList.remove("active-square");
          passTurn()
        }
      }, 100);
    }
  } else if (selectedPiece === i) {
    // YOUR PIECE IS HIGHLIGHTED AND YOU CLICK ON YOUR PIECE A SECOND TIME
    // REMOVE HIGHLIGHT AND REST selectedPiece
    element.classList.remove("active-square");
    selectedPiece = null;

  } else if (player.squares.includes(i)) {
    // IF YOU CLICK ON A SQUARE WITH YOUR PIECE
    // SET selectedPiece PIECE AND HIGHLIGHT
    selectedPiece = i;
    element.classList.toggle("active-square");
  } else if (legalSquares.includes(i)) {
    // IF YOU CLICK ON A LEGAL SQUARE THAT DOESN'T CONTAIN YOUR PIECE
    // REMOVE HIGHLIGHT AND RESET selectedPiece
    selectedPiece = null;
    element.classList.remove("active-square");
  } else {
    selectedPiece = null;
  }
  console.log(i);
  console.log(selectedPiece);
}

function anotherAction(player, element, i, opponent, prevSquare, nextSquare, squareOwner) {
  if (squareOwner && legalAttack(player, i) && legalSquares.includes(i)) {
    document.querySelectorAll(".legalSquare").forEach((square) => {
      square.classList.remove("active-square");
    });
    // JUMP A PIECE
    let tempSelected = completeMove(prevSquare, nextSquare, player, i);
    completeAttack(opponent, i);
    if (!anotherAttackAvailable(player, tempSelected)) {
      console.log("No addition legal attacks available");
      passTurn();
    } else {
      // how do we freeze all options except available attack on selected piece?
      console.log("Another legal attack is available");
      element.classList.add("active-square");
      selectedPiece = tempSelected;
      awaitingSecondOptionalAttack = true;
      setTimeout(function () {
        let answer = window.prompt("It's still your turn because a ***second*** jump is possible with your current piece. If DO NOT want to make the second jump type 'pass'. Otherwise, type 'ok' or press Enter.");
        if (answer === 'pass') {
          element.classList.remove("active-square");
          passTurn()
        }
      }, 100);
    }
  }
}

function attemptMove(player, element, i) {
  let opponent = playerSwap(player);
  let prevSquare = document.getElementById('n' + selectedPiece);
  let nextSquare = document.getElementById('n' + i);
  let squareOwner = player.squares.includes(selectedPiece);

  if (!awaitingSecondOptionalAttack) {
    firstAction(player, element, i, opponent, prevSquare, nextSquare, squareOwner);
  } else {
    anotherAction(player, element, i, opponent, prevSquare, nextSquare, squareOwner);
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
      attemptMove(currentPlayer, element, i);
    });

  }
}



function startGame() {
  currentPlayer = player1.color === 'white' ? player1 : player2;
}



initializeBoardSquares();
initializePlayers();
initializePlayerColorAndPieceClasses(player1, player2)

startGame();


