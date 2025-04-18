const getFriendlyPieceCollision = (pieces, movement, piece) => {
  return pieces.some((p) => {
    return (
      p.position.x === movement.x &&
      p.position.y === movement.y &&
      p.color === piece.color
    );
  });
};

const isInsideBoard = (x, y) => {
  return x >= 0 && y >= 0 && x <= 7 && y <= 7;
};

// TODO: evitar que peon se pueda mover 2 adelante si le estorban
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

  const filteredMovements = possibleMovements.filter((movement) => {
    return (
      isInsideBoard(movement.x, movement.y) &&
      getFriendlyPieceCollision(pieces, movement, piece) === false
    );
  });

  return filteredMovements;
};

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

  const filteredMovements = possibleMovements.filter((movement) => {
    return (
      isInsideBoard(movement.x, movement.y) &&
      getFriendlyPieceCollision(pieces, movement, piece) === false
    );
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

      if (
        isInsideBoard(newX, newY) &&
        getFriendlyPieceCollision(pieces, { x: newX, y: newY }, piece) === false
      ) {
        possibleMovements.push({ x: newX, y: newY });
      } else {
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

      if (
        isInsideBoard(newX, newY) &&
        getFriendlyPieceCollision(pieces, { x: newX, y: newY }, piece) === false
      ) {
        possibleMovements.push({ x: newX, y: newY });
      } else {
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
