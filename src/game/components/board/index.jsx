import "./board.css";
import { useState } from "react";

import { defineInitialPositions } from "../../../constants";
import {
  getPawnMovements,
  getKnightMovements,
  getKingMovements,
  getRookMovements,
  getBishopMovements,
  getQueenMovements,
} from "./movements";

const Board = ({ numbers }) => {
  const darkOnTop = numbers[0] === "8";

  const letters = darkOnTop
    ? ["a", "b", "c", "d", "e", "f", "g", "h"]
    : ["h", "g", "f", "e", "d", "c", "b", "a"];

  const [pieces, setPieces] = useState(defineInitialPositions(numbers));
  const [possiblePieceMovements, setPosiblePieceMovements] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);

  const getTileClassname = (x, y, hasPiece) => {
    let classname = "tile";

    classname += (x + y) % 2 === 0 ? " tile-white" : " tile-black";

    classname += hasPiece ? " has-piece" : "";

    const isPossibleMovement = possiblePieceMovements.some((movement) => {
      return movement.x === x && movement.y === y;
    });

    classname += isPossibleMovement ? " possible-movement" : "";

    classname +=
      selectedPiece &&
      selectedPiece.position.x === x &&
      selectedPiece.position.y === y
        ? " selected-piece"
        : "";

    return classname;
  };

  const handlePieceClick = (x, y, hasPiece, isPossibleMovement) => {
    if (!hasPiece) {
      if (isPossibleMovement) {
        const tempPieces = [...pieces];
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

        setPieces(tempPieces);
        setPosiblePieceMovements([]);
        setSelectedPiece(null);
      }
      return;
    }

    const piece = pieces.find((p) => {
      return p.position.x === x && p.position.y === y;
    });

    setSelectedPiece(piece);

    var possibleMovements = [];

    switch (piece.type) {
      case "pawn":
        possibleMovements = getPawnMovements(piece, x, y, darkOnTop, pieces);
        break;
      case "knight":
        possibleMovements = getKnightMovements(piece, x, y, pieces);
        break;
      case "king":
        possibleMovements = getKingMovements(piece, x, y, pieces);
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

    setPosiblePieceMovements(possibleMovements);
  };

  return (
    <div className="board">
      {numbers.map((number, y) => {
        return letters.map((letter, x) => {
          const hasPiece = pieces.some((piece) => {
            return piece.position.x === x && piece.position.y === y;
          });

          const isPossibleMovement = possiblePieceMovements.some((movement) => {
            return movement.x === x && movement.y === y;
          });

          return (
            <div
              key={`p${x}${y}`}
              className={getTileClassname(x, y, hasPiece)}
              onClick={() =>
                handlePieceClick(x, y, hasPiece, isPossibleMovement)
              }
            >
              {x === 0 && <span className="num-span">{number}</span>}
              {y === 7 && <span className="letter-span">{letter}</span>}
              {pieces.map((piece) => {
                return (
                  piece.position.x === x &&
                  piece.position.y === y && (
                    <img src={`/${piece.image}`} alt={piece.name} />
                  )
                );
              })}
              {isPossibleMovement && <div className="movement-icon"></div>}
            </div>
          );
        });
      })}
    </div>
  );
};

export default Board;
