import "./board.css";
import { useState } from "react";

import { defineInitialPositions } from "../../../constants";

const Board = ({ numbers }) => {
  const darkOnTop = numbers[0] === "8";

  const letters = darkOnTop
    ? ["a", "b", "c", "d", "e", "f", "g", "h"]
    : ["h", "g", "f", "e", "d", "c", "b", "a"];

  const [pieces, setPieces] = useState(defineInitialPositions(numbers));
  const [possiblePieceMovements, setPosiblePieceMovements] = useState([]);

  const getTileClassname = (x, y, hasPiece) => {
    let classname = "tile";

    classname += (x + y) % 2 === 0 ? " tile-white" : " tile-black";

    classname += hasPiece ? " has-piece" : "";

    const isPossibleMovement = possiblePieceMovements.some((movement) => {
      return movement.x === x && movement.y === y;
    });

    classname += isPossibleMovement ? " possible-movement" : "";

    return classname;
  };

  const handlePieceClick = (x, y, hasPiece) => {
    if (!hasPiece) {
      console.log(x, y);
      return;
    }

    console.log("Posición", x, y);
    const piece = pieces.find((p) => {
      return p.position.x === x && p.position.y === y;
    });

    console.log(piece);

    var possibleMovements = [];

    switch (piece.type) {
      case "pawn":
        possibleMovements = darkOnTop
          ? piece.color === "dark"
            ? [{ x: x, y: y + 1 }]
            : [{ x: x, y: y - 1 }]
          : piece.color === "dark"
          ? [{ x: x, y: y - 1 }]
          : [{ x: x, y: y + 1 }];

        if (!piece.hasMoved) {
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
        console.log("Posibles movimientos", possibleMovements);
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
          // hasPiece && console.log(x, y, hasPiece);
          return (
            <div
              key={`p${x}${y}`}
              className={getTileClassname(x, y, hasPiece)}
              onClick={() => handlePieceClick(x, y, hasPiece)}
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
            </div>
          );
        });
      })}
    </div>
  );
};

export default Board;
