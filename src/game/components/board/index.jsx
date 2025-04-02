import "./board.css";
import { useState } from "react";

import { defineInitialPositions } from "../../../constants";

const getTileClassname = (x, y, hasPiece) => {
  let classname = "tile";

  classname += (x + y) % 2 === 0 ? " tile-white" : " tile-black";

  classname += hasPiece ? " has-piece" : "";

  return classname;
};

const Board = ({ numbers }) => {
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const [pieces, setPieces] = useState(defineInitialPositions(numbers));

  const handlePieceClick = (x, y, hasPiece) => {
    if (!hasPiece) {
      console.log(x, y);
      return;
    }

    const darkOnTop = numbers[0] === "8";

    console.log(x, y);
    const piece = pieces.find((p) => {
      return p.position.x === x && p.position.y === y;
    });

    console.log(piece);

    // x MOVIMIENTO VERTICAL
    // y MOVIMIENTO HORIZONTAL

    switch (piece.type) {
      case "pawn":
        var possibleMovements = darkOnTop
          ? piece.color === "dark"
            ? { x: x + 1, y }
            : { x: x - 1, y }
          : piece.color === "dark"
          ? { x: x - 1, y }
          : { x: x + 1, y };
        console.log(possibleMovements);
        break;
    }
  };

  return (
    <div className="board">
      {numbers.map((number, x) => {
        return letters.map((letter, y) => {
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
              {y === 0 && <span className="num-span">{number}</span>}
              {x === 7 && <span className="letter-span">{letter}</span>}
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
