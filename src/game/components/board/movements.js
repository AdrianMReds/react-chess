const getPieceMovements = (piece, x, y, pieces) => {
  var possibleMovements = [];

  switch (piece.type) {
    case "knight":
      possibleMovements = getKnightMovements(piece, x, y, pieces);
      break;
    case "king":
      possibleMovements = getKingRawMovements(piece, x, y, pieces);
      break;
    case "rook":
      possibleMovements = getRookMovements(piece, x, y, pieces);
      break;
    case "bishop":
      possibleMovements = getBishopMovements(piece, x, y, pieces);
      break;
    case "queen":
      possibleMovements = getQueenMovements(piece, x, y, pieces);
      break;
  }
  console.log(typeof possibleMovements);
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

const movePiece = (tempPieces, selectedPiece, x, y) => {
  const tempPiece = tempPieces.find((p) => {
    return (
      p.position.x === selectedPiece.position.x &&
      p.position.y === selectedPiece.position.y
    );
  });

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

const isValidKingMovement = (pieces, movement, piece) => {
  const { color: kingColor } = piece;
  const { x, y } = movement;

  const enemyPieces = pieces.filter((p) => p.color !== kingColor);

  //Aquí agregaremos todos los posibles movimientos de las piezas enemigas a la lista enemyPossibleMovements
  enemyPieces.forEach((enemyPiece) => {
    if (enemyPiece.type === "pawn") {
    } else {
      var enemyPieceMovements = getPieceMovements(
        enemyPiece,
        enemyPiece.position.x,
        enemyPiece.position.y,
        pieces
      );

      return !enemyPieceMovements.some((pm) => {
        return pm.x === x && pm.y === y;
      });
    }
  });
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

// TODO: Movimiento en pasant
const getPawnMovements = (piece, x, y, darkOnTop, pieces) => {
  var possibleMovements = darkOnTop
    ? piece.color === "dark"
      ? [{ x: x, y: y + 1 }]
      : [{ x: x, y: y - 1 }]
    : piece.color === "dark"
    ? [{ x: x, y: y - 1 }]
    : [{ x: x, y: y + 1 }];

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

  const filteredMovements = possibleMovements.filter((movement) => {
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

  return filteredMovements;
};

const getKnightMovements = (piece, x, y, pieces) => {
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

  return filteredMovements;
};

/*
- Lógica de Jaque/JaqueMate
1. Que el rey no se pueda mover a casillas en jaque
2. Que ninguna pieza (a menos que sea para bloquear) se pueda mover a excepción del rey si el rey está en jaque
  2.1 Revisar después de cada turno si hay jaque
3. Jaque mate, si no hay movimientos posibles pues se acabo
*/

// TODO: Quitar movimientos de jaque
const getKingMovements = (piece, x, y, pieces) => {
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

  // Filtramos movimientos que no pongan al rey en jaque
  filteredMovements.forEach((movement) => {
    console.log(isValidKingMovement(pieces, movement, piece));
  });

  return filteredMovements;
};

const getRookMovements = (piece, x, y, pieces) => {
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

  return possibleMovements;
};

const getBishopMovements = (piece, x, y, pieces) => {
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

  return possibleMovements;
};

const getQueenMovements = (piece, x, y, pieces) => {
  const possibleMovements = [
    ...getRookMovements(piece, x, y, pieces),
    ...getBishopMovements(piece, x, y, pieces),
  ];

  return possibleMovements;
};

export {
  getPawnMovements,
  getKnightMovements,
  getKingMovements,
  getRookMovements,
  getBishopMovements,
  getQueenMovements,
  movePiece,
};
