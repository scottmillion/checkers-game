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

  document.getElementsByTagName("h2")[0].style.color = player1.color;
  document.getElementsByTagName("h2")[1].style.color = player2.color;
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

function updateDisplayData() {
  document.getElementsByTagName("span")[0].textContent = player1.squares.length;
  document.getElementsByTagName("span")[1].textContent = player2.squares.length;
}

function startGame() {
  initializeBoardSquares();
  [player1, player2]     = initializePlayers();
  initializePlayerColorAndPieceClasses(player1, player2)
  currentPlayer          = player1.color === 'white' ? player1 : player2;
  selectedPiece          = null;
  additionalAttackOption = false;
  updateDisplayData();
}

function resetBoard() {
  for (let i = 64; i > 0; i--) {
      let element = document.getElementById("n" + i);
      element.parentNode.removeChild(element);
    }
}

function newGame() {
  document.querySelector('.alerts').classList.add("hide");
  resetBoard();
  startGame();
}

function passTurn() {
  selectedPiece = null;
  additionalAttackOption = false;
  currentPlayer = playerSwap(currentPlayer);
  if (!(areThereAnyLegalMoves(currentPlayer) || areThereAnyLegalAttacks(currentPlayer, playerSwap(currentPlayer)))) {
    document.querySelector('.alerts').classList.remove("hide");
    document.getElementsByTagName("span")[2].innerHTML = "Game Over! " + playerSwap(currentPlayer).name + " wins! " + "<button id='playAgain'>Play Again</button>" ;
    document.getElementById("playAgain").addEventListener("click", (e) => {
      newGame();
    });
  }
  if(currentPlayer === player2) {
    setTimeout(function() { 
      computerTurn();
    }, 600);
    
  }
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
  console.log(squareNum);
  console.log(selectedPiece);
  let opponentPosition = squareNum + ((selectedPiece - squareNum) / 2);
  let removeIndex      = [opponent.squares.indexOf(opponentPosition)];
  console.log("<<<<<<<<<<<<<<<<<<<<<<<")
  console.log(opponentPosition);
  console.log(document.getElementById('n' + opponentPosition));
  console.log("<<<<<<<<<<<<<<<<<<<<<<<")
  document.getElementById('n' + opponentPosition).classList.remove(opponent.pieceClasses[removeIndex]);
  opponent.squares.splice(removeIndex, 1);
  opponent.pieceClasses.splice(removeIndex, 1);
}

function jumpPiece(player, squareNum, opponent, prevSquare, nextSquare) {
  let tempSelected = completeMove(prevSquare, nextSquare, player, squareNum);
  removeJumpedPiece(opponent, squareNum);
  updateDisplayData();
  if (!isThereALegalAttack(player, opponent, tempSelected)) {
    passTurn();
  } else if (currentPlayer === player2) {
    setTimeout(function() { 
      randomComputerAttack(squareNum);
    }, 600);
  } else {
    nextSquare.classList.add("active-square");
    selectedPiece = tempSelected;
    additionalAttackOption = true;

    let alertBox = document.querySelector('.alerts');
    alertBox.classList.remove("hide");
    document.getElementsByTagName("span")[2].innerHTML = "Jump again? <button id='yes'>Yes</button> <button id='no'>No</button>" ;
    document.getElementById("yes").addEventListener("click", (e) => {
      alertBox.classList.add("hide");
    });
    document.getElementById("no").addEventListener("click", (e) => {
      alertBox.classList.add("hide");
      nextSquare.classList.remove("active-square");
      passTurn();
    });
  }
}

// =================================================
// ================== CONTROLLERS ==================
// =================================================

function randomComputerAttack(compSelected) {
  let classSelected = player2.pieceClasses[player2.squares.indexOf(compSelected)];
  selectedPiece = compSelected;
  console.log("here");
  let upRightNum   = compSelected + 18;
  let upLeftNum    = compSelected + 14;
  let downRightNum = compSelected - 14;
  let downLeftNum  = compSelected - 18;

  let isUpRight    = emptySquare(upRightNum) && player1.squares.includes(compSelected + 9);
  let isUpLeft     = emptySquare(upLeftNum) && player1.squares.includes(compSelected + 7);
  let isDownRight  = emptySquare(downRightNum) && player1.squares.includes(compSelected - 7);
  let isDownLeft   = emptySquare(downLeftNum) && player1.squares.includes(compSelected - 9);
  
  let attackResults = [isUpRight, isUpLeft, isDownRight, isDownLeft];
  let legalAttackIndexes = [];
  for(let i = 0; i < attackResults.length; i++) {
    console.log("attack results");
    console.log(attackResults[i]);
    if (attackResults[i]) {
      if (classSelected === "black-piece-king" || classSelected === "white-piece-king") { 
        console.log("king condition met")
        legalAttackIndexes.push(i);
      } else if (i === 2 || i === 3) { 
        console.log("pawn condition met")
        legalAttackIndexes.push(i);      
      }
    }
  }
  let chosenAttackIndex = legalAttackIndexes[Math.floor(Math.random() * legalAttackIndexes.length)];
  let prevSquare = document.getElementById("n" + compSelected);

  if(chosenAttackIndex === 0) { 
    console.log(upRightNum);
    console.log(prevSquare);
    console.log(document.getElementById("n" + upRightNum));
    console.log(player2.name);
    console.log(player1.name);
    jumpPiece(player2, upRightNum, player1, prevSquare, document.getElementById("n" + upRightNum));
    return;
  };
  if(chosenAttackIndex === 1) { 
    console.log(upLeftNum);
    console.log(prevSquare);
    console.log(document.getElementById("n" + upLeftNum));
    console.log(player2.name);
    console.log(player1.name);
    jumpPiece(player2, upLeftNum, player1, prevSquare, document.getElementById("n" + upLeftNum));
    return;
  };
  if(chosenAttackIndex === 2) { 
    console.log(downRightNum);
    console.log(prevSquare);
    console.log(document.getElementById("n" + downRightNum));
    console.log(player2.name);
    console.log(player1.name);
    jumpPiece(player2, downRightNum, player1, prevSquare, document.getElementById("n" + downRightNum))
    return;
  };
  if(chosenAttackIndex === 3) { 
    console.log(downLeftNum);
    console.log(prevSquare);
    console.log(document.getElementById("n" + downLeftNum));
    console.log(player2.name);
    console.log(player1.name);
    jumpPiece(player2, downLeftNum, player1, prevSquare, document.getElementById("n" + downLeftNum));
    return;
  };

  console.log('chosen attack num');
  console.log(chosenAttackIndex);
  console.log('******err in randomComputerAttack******');
};

function computerTurn() {
  if (areThereAnyLegalAttacks(player2, player1)) {
    let attackSquares = [];
    let attackClasses = [];
    for(let i = 0; i < player2.squares.length; i++) {
      let compSelected = player2.squares[i];
      if (isThereALegalAttack(player2, player1, compSelected)) {
        attackSquares.push(compSelected);
        attackClasses.push(player2.pieceClasses[i]);
      }
    }
    let randomAttackIndex = Math.floor(Math.random() * attackSquares.length);
    let compSelected = attackSquares[randomAttackIndex];
    let classSelected = attackClasses[randomAttackIndex];
    console.log("comp selected")
    console.log(compSelected);
    randomComputerAttack(compSelected);
    
    //MAKE A RANDOM ATTACK
    //IF CAN ATTACK AGAIN, DO SO
  } else if (areThereAnyLegalMoves(player2)) {
    //MAKE A RANDOM MOVE
  } else {
    console.log("ERROR IN COMPUTER LOGIC. GAME SHOULD BE OVER");
  }
}

function playerTurnAction(player, square, squareNum) {
  // CONTROLLER EXECUTES WHENEVER A PLAYER CLICKS ON A SQUARE (SEE EVENT LISTENER IN initializeBoardSquares())
  let opponent    = playerSwap(player);
  let prevSquare  = document.getElementById('n' + selectedPiece);
  let nextSquare  = square;
  let squareOwner = player.squares.includes(selectedPiece);
  let preMoveReq  = squareOwner && legalSquares.includes(squareNum);
  document.querySelector('.alerts').classList.add("hide");

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