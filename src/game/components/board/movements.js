const getPieceMovements = (
  piece,
  x,
  y,
  pieces,
  darkOnTop,
  fromBoard = false,
  lastMovement = ""
) => {
  var possibleMovements = [];
  console.log("Getting movements for piece:", piece, "at position:", x, y);
  console.log(piece.type);
  switch (piece.type) {
    case "pawn":
      possibleMovements = fromBoard
        ? getPawnMovements(
            piece,
            x,
            y,
            darkOnTop,
            pieces,
            fromBoard,
            lastMovement
          )
        : darkOnTop
        ? piece.color === "dark"
          ? [
              { x: x - 1, y: y + 1 },
              { x: x + 1, y: y + 1 },
            ]
          : [
              { x: x - 1, y: y - 1 },
              { x: x + 1, y: y - 1 },
            ]
        : piece.color === "dark"
        ? [
            { x: x - 1, y: y - 1 },
            { x: x + 1, y: y - 1 },
          ]
        : [
            { x: x - 1, y: y + 1 },
            { x: x + 1, y: y + 1 },
          ];
      break;
    case "knight":
      possibleMovements = getKnightMovements(
        piece,
        x,
        y,
        pieces,
        darkOnTop,
        fromBoard
      );
      break;
    case "king":
      possibleMovements = fromBoard
        ? getKingMovements(piece, x, y, pieces, darkOnTop, fromBoard)
        : getKingRawMovements(piece, x, y, pieces);
      break;
    case "rook":
      possibleMovements = getRookMovements(
        piece,
        x,
        y,
        pieces,
        darkOnTop,
        fromBoard
      );
      break;
    case "bishop":
      possibleMovements = getBishopMovements(
        piece,
        x,
        y,
        pieces,
        darkOnTop,
        fromBoard
      );
      break;
    case "queen":
      possibleMovements = getQueenMovements(
        piece,
        x,
        y,
        pieces,
        darkOnTop,
        fromBoard
      );
      break;
  }
  return possibleMovements;
};

//Función para obtener movimientos de rey opuesto (Checar jaque)
const getKingRawMovements = (piece, x, y, pieces) => {
  var possibleMovements = [
    { x: x - 1, y: y - 1 },
    { x: x - 1, y: y },
    { x: x - 1, y: y + 1 },
    { x: x, y: y - 1 },
    { x: x, y: y + 1 },
    { x: x + 1, y: y - 1 },
    { x: x + 1, y: y },
    { x: x + 1, y: y + 1 },
  ];

  var filteredMovements = possibleMovements.filter((movement) => {
    return (
      isInsideBoard(movement.x, movement.y) &&
      getFriendlyPieceCollision(pieces, movement, piece) === false
    );
  });

  return filteredMovements;
};

const movePiece = (tempPieces, selectedPiece, x, y, isTake = false) => {
  const tempPiece = tempPieces.find((p) => {
    return (
      p.position.x === selectedPiece.position.x &&
      p.position.y === selectedPiece.position.y
    );
  });

  if (isTake) {
    const tempRemovedPiece = tempPieces.find((piece) => {
      return piece.position.x === x && piece.position.y === y;
    });

    const tempRemovedPieceIndex = tempPieces.indexOf(tempRemovedPiece);

    if (tempRemovedPiece) {
      tempPieces.splice(tempRemovedPieceIndex, 1);
    }
  }

  const pieceIndex = tempPieces.indexOf(tempPiece);

  tempPieces[pieceIndex].position.x = x;
  tempPieces[pieceIndex].position.y = y;

  tempPieces[pieceIndex].hasMoved = true;

  return tempPieces;
};

const getFriendlyPieceCollision = (pieces, movement, piece) => {
  return pieces.some((p) => {
    return (
      p.position.x === movement.x &&
      p.position.y === movement.y &&
      p.color === piece.color
    );
  });
};

//Está función ya funciona como "isKingOnCheck" para revisar si un rey está en jaque antes y después de mover pieza
const isKingOnCheck = (pieces, movement, piece, darkOnTop) => {
  const { color: kingColor } = piece;
  const { x, y } = movement;

  const enemyPieces = pieces.filter((p) => p.color !== kingColor);

  for (var i = 0; i < enemyPieces.length; i++) {
    var enemyPiece = enemyPieces[i];
    var enemyPieceMovements = getPieceMovements(
      enemyPiece,
      enemyPiece.position.x,
      enemyPiece.position.y,
      pieces,
      darkOnTop
    );

    if (
      enemyPieceMovements.length &&
      enemyPieceMovements.some((pm) => {
        return pm.x === x && pm.y === y;
      })
    ) {
      return false;
    }
  }
  return true;
};

const getPossibleTakes = (pieces, movement, piece) => {
  const response = pieces.some((p) => {
    return (
      p.position.x === movement.x &&
      p.position.y === movement.y &&
      p.color !== piece.color
    );
  });
  return response;
};

const isInsideBoard = (x, y) => {
  return x >= 0 && y >= 0 && x <= 7 && y <= 7;
};

const checkEnPasant = (pieces, piece, lastx, lasty) => {
  //Checar pieza izquierda
  const leftPiece = pieces.find((p) => {
    return (
      p.position.x === piece.position.x - 1 &&
      p.position.y === piece.position.y &&
      p.type === "pawn" &&
      p.color !== piece.color
    );
  });

  const rightPiece = pieces.find((p) => {
    return (
      p.position.x === piece.position.x + 1 &&
      p.position.y === piece.position.y &&
      p.type === "pawn" &&
      p.color !== piece.color
    );
  });

  if (leftPiece) {
    //Checar si ese peón fue el último movimiento

    //Comparar esas coordenadas de lastMovement con las coords de leftPiece, si son iguales en pasant es posible

    if (
      lastx !== undefined &&
      lasty !== NaN &&
      lastx === leftPiece.position.x &&
      lasty === leftPiece.position.y
    ) {
      return true;
    }

    //Hay que quitar la pieza enemiga de donde está aunque no se haya atacado directamente
  }

  //Checar pieza derecha
  if (rightPiece) {
    //Checar si ese peón fue el último movimiento

    //Comparar esas coordenadas de lastMovement con las coords de rightPiece, si son iguales en pasant es posible

    if (
      lastx !== undefined &&
      lasty !== NaN &&
      lastx === rightPiece.position.x &&
      lasty === rightPiece.position.y
    ) {
      return true;
    }

    //Hay que quitar la pieza enemiga de donde está aunque no se haya atacado directamente
  }

  return false;
};

const getPawnMovements = (
  piece,
  x,
  y,
  darkOnTop,
  pieces,
  fromBoard = false,
  lastMovement
) => {
  var possibleMovements = darkOnTop
    ? piece.color === "dark"
      ? [{ x: x, y: y + 1 }]
      : [{ x: x, y: y - 1 }]
    : piece.color === "dark"
    ? [{ x: x, y: y - 1 }]
    : [{ x: x, y: y + 1 }];

    console.log("Possible Movements primera iteracion:", possibleMovements);

  // Usamos getPossibleTakes para ver si hay una pieza enemiga y quitar el movimiento
  if (getPossibleTakes(pieces, possibleMovements[0], piece)) {
    possibleMovements.pop();
  }

  if (
    possibleMovements.length &&
    !piece.hasMoved &&
    !getFriendlyPieceCollision(pieces, possibleMovements[0], piece)
  ) {
    possibleMovements.push(
      darkOnTop
        ? piece.color === "dark"
          ? { x: x, y: y + 2 }
          : { x: x, y: y - 2 }
        : piece.color === "dark"
        ? { x: x, y: y - 2 }
        : { x: x, y: y + 2 }
    );

    console.log("Possible Movements segunda iteracion:", possibleMovements);

    if (
      getPossibleTakes(
        pieces,
        possibleMovements[possibleMovements.length - 1],
        piece
      )
    ) {
      possibleMovements.pop();
    }
  }

  const possibleTakes = darkOnTop
    ? piece.color === "dark"
      ? //Va hacia abajo
        [
          { x: x + 1, y: y + 1 },
          { x: x - 1, y: y + 1 },
        ]
      : //Va hacia arriba
        [
          { x: x + 1, y: y - 1 },
          { x: x - 1, y: y - 1 },
        ]
    : piece.color === "dark"
    ? // Va hacia arriba
      [
        { x: x + 1, y: y - 1 },
        { x: x - 1, y: y - 1 },
      ]
    : // Va hacia abajo
      [
        { x: x + 1, y: y + 1 },
        { x: x - 1, y: y + 1 },
      ];

  var filteredMovements = possibleMovements.filter((movement) => {
    return (
      isInsideBoard(movement.x, movement.y) &&
      getFriendlyPieceCollision(pieces, movement, piece) === false
    );
  });

  // Solo checar si alguno de possibleTakes es un take
  possibleTakes.forEach((take) => {
    if (getPossibleTakes(pieces, take, piece)) {
      filteredMovements.push({ ...take, isTake: true });
    }
  });

  const darkxvalues = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
  };

  const xvalues = {
    a: 7,
    b: 6,
    c: 5,
    d: 4,
    e: 3,
    f: 2,
    g: 1,
    h: 0,
  };

  const lastx = darkOnTop
    ? darkxvalues[lastMovement[0]]
    : xvalues[lastMovement[0]];

  var lasty = lastMovement[1];
  lasty = parseInt(lasty);

  lasty = lasty ? (darkOnTop ? 8 - lasty : lasty - 1) : lasty;

  //Revisar posible en pasant
  if (y === 3) {
    if (darkOnTop && piece.color === "light") {
      if (checkEnPasant(pieces, piece, lastx, lasty)) {
        filteredMovements.push({
          x: lastx,
          y: lasty - 1,
          isTake: true,
        });
      }
    }

    if (!darkOnTop && piece.color === "dark") {
      if (checkEnPasant(pieces, piece, lastx, lasty)) {
        filteredMovements.push({
          x: lastx,
          y: lasty - 1,
          isTake: true,
        });
      }
    }
  }

  if (y === 4) {
    if (!darkOnTop && piece.color === "light") {
      if (checkEnPasant(pieces, piece, lastx, lasty)) {
        filteredMovements.push({
          x: lastx,
          y: lasty + 1,
          isTake: true,
        });
      }
    }

    if (darkOnTop && piece.color === "dark") {
      if (checkEnPasant(pieces, piece, lastx, lasty)) {
        filteredMovements.push({
          x: lastx,
          y: lasty + 1,
          isTake: true,
        });
      }
    }
  }

  if (fromBoard) {
    //Por cada movimiento (loop) -> simular movimiento de pieza -> extraer el rey del mismo color -> revisar que con ese movimiento hecho el rey no esté en jaque
    const tempKing = pieces.find((p) => {
      return p.type === "king" && p.color === piece.color;
    });

    filteredMovements = filteredMovements.filter((movement) => {
      var tempPieces = JSON.parse(JSON.stringify(pieces));

      tempPieces = movePiece(
        tempPieces,
        piece,
        movement.x,
        movement.y,
        movement.isTake
      );

      return isKingOnCheck(tempPieces, tempKing.position, tempKing, darkOnTop);
    });
  }

  return filteredMovements;
};

const getKnightMovements = (
  piece,
  x,
  y,
  pieces,
  darkOnTop,
  fromBoard = false
) => {
  const possibleMovements = [
    { x: x - 2, y: y - 1 },
    { x: x - 2, y: y + 1 },
    { x: x + 2, y: y - 1 },
    { x: x + 2, y: y + 1 },
    { x: x - 1, y: y - 2 },
    { x: x - 1, y: y + 2 },
    { x: x + 1, y: y - 2 },
    { x: x + 1, y: y + 2 },
  ];

  var filteredMovements = possibleMovements.filter((movement) => {
    return (
      isInsideBoard(movement.x, movement.y) &&
      getFriendlyPieceCollision(pieces, movement, piece) === false
    );
  });

  filteredMovements = filteredMovements.map((movement) => {
    return getPossibleTakes(pieces, movement, piece)
      ? { ...movement, isTake: true }
      : movement;
  });

  if (fromBoard) {
    //Por cada movimiento (loop) -> simular movimiento de pieza -> extraer el rey del mismo color -> revisar que con ese movimiento hecho el rey no esté en jaque
    const tempKing = pieces.find((p) => {
      return p.type === "king" && p.color === piece.color;
    });

    filteredMovements = filteredMovements.filter((movement) => {
      var tempPieces = JSON.parse(JSON.stringify(pieces));

      tempPieces = movePiece(
        tempPieces,
        piece,
        movement.x,
        movement.y,
        movement.isTake
      );

      return isKingOnCheck(tempPieces, tempKing.position, tempKing, darkOnTop);
    });
  }

  return filteredMovements;
};

/*
Reglas de enroque:
1. Que no se haya movido ni el rey ni la torre
2. Que no haya piezas en medio del rey y la torre
3. Que ninguno de los cuadritos por donde se desplaza el rey estén en jaque.
*/
const getKingMovements = (
  piece,
  x,
  y,
  pieces,
  darkOnTop,
  fromBoard = false
) => {
  var possibleMovements = [
    { x: x - 1, y: y - 1 },
    { x: x - 1, y: y },
    { x: x - 1, y: y + 1 },
    { x: x, y: y - 1 },
    { x: x, y: y + 1 },
    { x: x + 1, y: y - 1 },
    { x: x + 1, y: y },
    { x: x + 1, y: y + 1 },
  ];

  var filteredMovements = possibleMovements.filter((movement) => {
    return (
      isInsideBoard(movement.x, movement.y) &&
      getFriendlyPieceCollision(pieces, movement, piece) === false
    );
  });

  filteredMovements = filteredMovements.map((movement) => {
    return getPossibleTakes(pieces, movement, piece)
      ? { ...movement, isTake: true }
      : movement;
  });

  if (!piece.hasMoved) {
    //Encontrar las torres amigas
    const rook1 = pieces.find((p) => {
      return p.type === "rook" && p.color === piece.color;
    });

    const rook2 = pieces.find((p) => {
      return (
        p.type === "rook" && p.color === piece.color && p.name !== rook1?.name
      );
    });

    //Ver si las torres amigas ya se movieron
    if (rook1 && !rook1.hasMoved) {
      const rook1Movements = getRookMovements(
        rook1,
        rook1.position.x,
        rook1.position.y,
        pieces,
        darkOnTop
      );

      var castle1 = false;

      if (rook1.position.x === 0) {
        if (rook1Movements.length >= 3) {
          for (let i = 1; i < 4; i++) {
            //Si no tiene el movimiento que se salga del for (que ya no cheque más)
            if (
              !rook1Movements.some((m) => {
                return m.x === rook1.position.x + i && m.y === rook1.position.y;
              })
            ) {
              castle1 = false;
              break;
            }
            if (
              !isKingOnCheck(
                pieces,
                { x: rook1.position.x + i, y: rook1.position.y },
                piece,
                darkOnTop
              )
            ) {
              castle1 = false;
              break;
            }
            castle1 = true;
          }
        }
        if (castle1) {
          filteredMovements.push({
            x: piece.position.x - 2,
            y: piece.position.y,
            isCastle: true,
          });
        }
      } else {
        //Rook2 cuando mataron a rook1
        if (rook1Movements.length >= 2) {
          for (let i = 2; i > 0; i--) {
            //Si no tiene el movimiento que se salga del for (que ya no cheque más)
            if (
              !rook1Movements.some((m) => {
                return m.x === rook1.position.x - i && m.y === rook1.position.y;
              })
            ) {
              castle1 = false;
              break;
            }
            if (
              !isKingOnCheck(
                pieces,
                { x: rook1.position.x - i, y: rook1.position.y },
                piece,
                darkOnTop
              )
            ) {
              castle1 = false;
              break;
            }
            castle1 = true;
          }
        }
        if (castle1) {
          filteredMovements.push({
            x: piece.position.x + 2,
            y: piece.position.y,
            isCastle: true,
          });
        }
      }
    }

    if (rook2 && !rook2.hasMoved) {
      const rook2Movements = getRookMovements(
        rook2,
        rook2.position.x,
        rook2.position.y,
        pieces,
        darkOnTop
      );

      var castle2 = false;

      if (rook2Movements.length >= 2) {
        for (let i = 2; i > 0; i--) {
          //Si no tiene el movimiento que se salga del for (que ya no cheque más)
          if (
            !rook2Movements.some((m) => {
              return m.x === rook2.position.x - i && m.y === rook2.position.y;
            })
          ) {
            castle2 = false;
            break;
          }
          if (
            !isKingOnCheck(
              pieces,
              { x: rook2.position.x - i, y: rook2.position.y },
              piece,
              darkOnTop
            )
          ) {
            castle2 = false;
            break;
          }
          castle2 = true;
        }
        if (castle2) {
          filteredMovements.push({
            x: piece.position.x + 2,
            y: piece.position.y,
            isCastle: true,
          });
        }
      }
    }

    //Revisar si hay piezas entre el rey y la torre
    // Checar con possibleMovements entre el rey y la torre

    //Revisar que no estén en jaque ambos cuadritos
  }

  if (fromBoard) {
    //Por cada movimiento (loop) -> simular movimiento de pieza -> extraer el rey del mismo color -> revisar que con ese movimiento hecho el rey no esté en jaque
    const tempKing = pieces.find((p) => {
      return p.type === "king" && p.color === piece.color;
    });

    filteredMovements = filteredMovements.filter((movement) => {
      var tempPieces = JSON.parse(JSON.stringify(pieces));

      tempPieces = movePiece(
        tempPieces,
        piece,
        movement.x,
        movement.y,
        movement.isTake
      );

      return isKingOnCheck(
        tempPieces,
        { x: movement.x, y: movement.y },
        tempKing,
        darkOnTop
      );
    });
  }

  return filteredMovements;
};

const getRookMovements = (
  piece,
  x,
  y,
  pieces,
  darkOnTop,
  fromBoard = false
) => {
  var possibleMovements = [];

  const directions = [
    { dx: 0, dy: -1 }, // Arriba
    { dx: 0, dy: 1 }, // Abajo
    { dx: -1, dy: 0 }, // Izquierda
    { dx: 1, dy: 0 }, // Derecha
  ];

  directions.forEach(({ dx, dy }) => {
    for (let i = 1; i < 8; i++) {
      let newX = x + dx * i;
      let newY = y + dy * i;

      // Verificamos si la nueva posición está dentro del tablero
      if (isInsideBoard(newX, newY)) {
        // Verificamos si hay una pieza enemiga en la nueva posición
        if (getPossibleTakes(pieces, { x: newX, y: newY }, piece)) {
          possibleMovements.push({ x: newX, y: newY, isTake: true });
          break;
        }
        // Verificamos si hay una pieza amiga en la nueva posición
        if (
          getFriendlyPieceCollision(pieces, { x: newX, y: newY }, piece) ===
          false
        ) {
          possibleMovements.push({ x: newX, y: newY });
        } else {
          // Si hay una pieza amiga, no podemos movernos más en esa dirección
          break;
        }
      } else {
        // Si la nueva posición está fuera del tablero, no podemos movernos más en esa dirección
        break;
      }
    }
  });

  if (fromBoard) {
    //Por cada movimiento (loop) -> simular movimiento de pieza -> extraer el rey del mismo color -> revisar que con ese movimiento hecho el rey no esté en jaque
    const tempKing = pieces.find((p) => {
      return p.type === "king" && p.color === piece.color;
    });

    possibleMovements = possibleMovements.filter((movement) => {
      var tempPieces = JSON.parse(JSON.stringify(pieces));

      tempPieces = movePiece(
        tempPieces,
        piece,
        movement.x,
        movement.y,
        movement.isTake
      );

      return isKingOnCheck(tempPieces, tempKing.position, tempKing, darkOnTop);
    });
  }

  return possibleMovements;
};

const getBishopMovements = (
  piece,
  x,
  y,
  pieces,
  darkOnTop,
  fromBoard = false
) => {
  var possibleMovements = [];

  const directions = [
    { dx: 1, dy: -1 }, // Arriba derecha
    { dx: -1, dy: -1 }, // Arriba izquierda
    { dx: 1, dy: 1 }, // Abajo derecha
    { dx: -1, dy: 1 }, // Abajo izquierda
  ];

  directions.forEach(({ dx, dy }) => {
    for (let i = 1; i < 8; i++) {
      let newX = x + dx * i;
      let newY = y + dy * i;

      // Verificamos si la nueva posición está dentro del tablero
      if (isInsideBoard(newX, newY)) {
        // Verificamos si hay una pieza enemiga en la nueva posición
        if (getPossibleTakes(pieces, { x: newX, y: newY }, piece)) {
          possibleMovements.push({ x: newX, y: newY, isTake: true });
          break;
        }
        // Verificamos si hay una pieza amiga en la nueva posición
        if (
          getFriendlyPieceCollision(pieces, { x: newX, y: newY }, piece) ===
          false
        ) {
          possibleMovements.push({ x: newX, y: newY });
        } else {
          // Si hay una pieza amiga, no podemos movernos más en esa dirección
          break;
        }
      } else {
        // Si la nueva posición está fuera del tablero, no podemos movernos más en esa dirección
        break;
      }
    }
  });

  // Checar que movimientos no pongan en jaque

  if (fromBoard) {
    //Por cada movimiento (loop) -> simular movimiento de pieza -> extraer el rey del mismo color -> revisar que con ese movimiento hecho el rey no esté en jaque
    const tempKing = pieces.find((p) => {
      return p.type === "king" && p.color === piece.color;
    });

    possibleMovements = possibleMovements.filter((movement) => {
      var tempPieces = JSON.parse(JSON.stringify(pieces));

      tempPieces = movePiece(
        tempPieces,
        piece,
        movement.x,
        movement.y,
        movement.isTake
      );

      return isKingOnCheck(tempPieces, tempKing.position, tempKing, darkOnTop);
    });
  }

  return possibleMovements;
};

const getQueenMovements = (
  piece,
  x,
  y,
  pieces,
  darkOnTop,
  fromBoard = false
) => {
  const possibleMovements = [
    ...getRookMovements(piece, x, y, pieces, darkOnTop, fromBoard),
    ...getBishopMovements(piece, x, y, pieces, darkOnTop, fromBoard),
  ];

  return possibleMovements;
};

/*
Con torres y caballos:
- Movimientos que tengan en común antes de hacer el movimiento
- Si las piezas antes del movimiento tienen en común x o y
- Si el movimiento que se realizó después fue un movimiento en común
*/

const getMovementString = (
  piece,
  pieces,
  x,
  y,
  isTake,
  isKingOnCheck,
  isCommon,
  lastCoordinates,
  darkOnTop,
  conversionType = ""
) => {
  const typeLetter = {
    rook: "R",
    knight: "N",
    king: "K",
    queen: "Q",
    bishop: "B",
  };

  const xvalues = {
    0: "a",
    1: "b",
    2: "c",
    3: "d",
    4: "e",
    5: "f",
    6: "g",
    7: "h",
  };

  // Letra mayuscula ->  isCommon? -> es take? (caso peon) -> letra (x) -> número (y) -> isKingOnCheck

  var movementString = "";
  if (piece.type === "pawn") {
    if (isTake) {
      movementString += darkOnTop
        ? xvalues[lastCoordinates.x]
        : xvalues[7 - lastCoordinates.x];
      movementString += "x";
    }

    movementString += darkOnTop ? xvalues[x] : xvalues[7 - x];
    movementString += darkOnTop ? `${8 - y}` : `${y + 1}`;

    if (isKingOnCheck) {
      movementString += "+";
    }
  } else {
    movementString += typeLetter[piece.type];

    if (isCommon) {
      const commonPiece = pieces.find((p) => {
        return (
          p.type === piece.type &&
          p.color === piece.color &&
          p.name !== piece.name
        );
      });

      //Comparar lastCoordinates y coordenadas de commonPiece
      //Si la x es igual usamos la y(numero), si la y es igual usamos la x(letra). Si ninguno es igual usamos la x(letra).
      if (lastCoordinates.x === commonPiece.position.x) {
        movementString += darkOnTop
          ? `${8 - lastCoordinates.y}`
          : `${lastCoordinates.y + 1}`; // Se agrega el número
      } else {
        movementString += darkOnTop
          ? xvalues[lastCoordinates.x]
          : xvalues[7 - lastCoordinates.x]; // Se agrega la letra
      }
    }

    if (isTake) {
      movementString += "x";
    }
    movementString += darkOnTop ? xvalues[x] : xvalues[7 - x];
    movementString += darkOnTop ? `${8 - y}` : `${y + 1}`;

    if (isKingOnCheck) {
      movementString += "+";
    }
  }
  if (conversionType) {
    movementString += `=${typeLetter[conversionType]}`;
  }
  return movementString;
};

const getMovementsInCommon = (
  piece1Movements,
  piece2,
  pieces,
  darkOnTop,
  fromBoard
) => {
  //Sacar movimientos de piece2 []
  const piece2Movements =
    piece2.type === "knight"
      ? getKnightMovements(
          piece2,
          piece2.position.x,
          piece2.position.y,
          pieces,
          darkOnTop,
          fromBoard
        )
      : getRookMovements(
          piece2,
          piece2.position.x,
          piece2.position.y,
          pieces,
          darkOnTop,
          fromBoard
        );

  //Necesitamos obtener los movimientos en común
  const commonMovements = piece1Movements.filter((movement) => {
    return piece2Movements.some((movement2) => {
      return movement2.x === movement.x && movement2.y === movement.y;
    });
  });

  //Regresar la lista filtrada
  return commonMovements;
};

const validateMovement = (pieces, piece, movement, darkOnTop, lastMovement) => {
  const darkxvalues = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
  };

  const xvalues = {
    a: 7,
    b: 6,
    c: 5,
    d: 4,
    e: 3,
    f: 2,
    g: 1,
    h: 0,
  };
  // piece : d7
  // movement : d5

  // Pieza -> Coordenadas
  const pieceX = piece[0];
  const pieceY = parseInt(piece[1]);
  const pieceCoords = {
    x: darkOnTop ? darkxvalues[pieceX] : xvalues[pieceX],
    y: darkOnTop ? 8 - pieceY : pieceY - 1,
  };

  console.log("Piece Coords:", pieceCoords);
  // Movimiento -> Coordenadas
  const cleanMovement = ["N", "R", "B", "Q", "K", "x", "+", "#"];

	let i = 0;
	while (movement.length > 2) {
		movement = movement.replace(cleanMovement[i], "");
		i++;

		if (i > cleanMovement.length - 1) {
			movement = movement.slice(1);
		}
	}

  const movementX = movement[0];
  const movementY = parseInt(movement[1]);
  const movementCoords = {
    x: darkOnTop ? darkxvalues[movementX] : xvalues[movementX],
    y: darkOnTop ? 8 - movementY : movementY - 1,
  };

  console.log("Movement Coords:", movementCoords);
  // Validar el movimiento con sus coordenadas
      // Comparar con possibleMovements de la pieza

  const selectedPiece = pieces.find((p)=>{
    return p.position.x === pieceCoords.x && p.position.y === pieceCoords.y;
  });

  const possibleMovements = selectedPiece.type === "pawn" ? getPawnMovements(
    selectedPiece,
    pieceCoords.x,
    pieceCoords.y,
    darkOnTop,
    pieces,
    false,
    lastMovement
  ) : getPieceMovements(
    selectedPiece,
    pieceCoords.x,
    pieceCoords.y,
    pieces,
    darkOnTop,
    false,
    lastMovement
  );

  console.log("Possible Movements:", possibleMovements);

  const checkMovement = possibleMovements.find((pm) => {
    return pm.x === movementCoords.x && pm.y === movementCoords.y;
  })

  const isValid = checkMovement ? true : false;

  return {isValid, piece: selectedPiece, movement: movementCoords, isTake: checkMovement ? checkMovement.isTake || false : false};
  
  // Estructura del return
  // {isValid : bool, piece: coords, movement: coords, isTake: bool}
};

export {
  getPawnMovements,
  getKnightMovements,
  getKingMovements,
  getRookMovements,
  getBishopMovements,
  getQueenMovements,
  movePiece,
  isKingOnCheck,
  getPieceMovements,
  getMovementString,
  getMovementsInCommon,
  validateMovement,
};
