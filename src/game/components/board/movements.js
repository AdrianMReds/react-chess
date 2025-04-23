const getFriendlyPieceCollision = (pieces, movement, piece) => {
  return pieces.some((p) => {
    return (
      p.position.x === movement.x &&
      p.position.y === movement.y &&
      p.color === piece.color
    );
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

const getPawnMovements = (piece, x, y, darkOnTop, pieces) => {
  var possibleMovements = darkOnTop
    ? piece.color === "dark"
      ? [{ x: x, y: y + 1 }]
      : [{ x: x, y: y - 1 }]
    : piece.color === "dark"
    ? [{ x: x, y: y - 1 }]
    : [{ x: x, y: y + 1 }];

  console.log("possibleMovmentsPawn", possibleMovements[0]);

  if (
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

  // Solo checar si alguno de possibleTakes es un take

  const filteredMovements = possibleMovements.filter((movement) => {
    return (
      isInsideBoard(movement.x, movement.y) &&
      getFriendlyPieceCollision(pieces, movement, piece) === false
    );
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

  console.log("filteredMovementsKing", filteredMovements);

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
};
