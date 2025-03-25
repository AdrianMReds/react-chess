import "./board.css";
import { useState } from "react";

import { defineInitialPositions } from "../../../constants";

const getTileClassname = (x, y) => {
  let classname = "tile";

  classname += (x + y) % 2 === 0 ? " tile-white" : " tile-black";

  return classname;
};

const Board = ({ numbers }) => {
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const [pieces, setPieces] = useState(defineInitialPositions(numbers));

  console.log(pieces);

  return (
    <div className="board">
      {numbers.map((number, x) => {
        return letters.map((letter, y) => {
          return (
            <div className={getTileClassname(x, y)}>
              {y === 0 && <span className="num-span">{number}</span>}
              {x === 7 && <span className="letter-span">{letter}</span>}
              {pieces.map((piece) => {
                piece.position.x === x && piece.position.y === y && (
                  <div className="piece">{piece.name}</div>
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
