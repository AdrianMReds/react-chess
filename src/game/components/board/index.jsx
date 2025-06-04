import "./board.css";
import { use, useState } from "react";

import { defineInitialPositions } from "../../../constants";
import {
  getPawnMovements,
  getKnightMovements,
  getKingMovements,
  getRookMovements,
  getBishopMovements,
  getQueenMovements,
  movePiece,
  isKingOnCheck,
  getPieceMovements,
} from "./movements";

const Board = ({
  numbers,
  capturesTop,
  setCapturesTop,
  capturesBottom,
  setCapturesBottom,
  checkMate,
  setCheckMate,
  staleMate,
  setStaleMate,
  winner,
  setWinner,
}) => {
  const darkOnTop = numbers[0] === "8";

  const letters = darkOnTop
    ? ["a", "b", "c", "d", "e", "f", "g", "h"]
    : ["h", "g", "f", "e", "d", "c", "b", "a"];

  const [pieces, setPieces] = useState(defineInitialPositions(numbers));
  const [possiblePieceMovements, setPosiblePieceMovements] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);

  const [lightKingOnCheck, setLightKingOnCheck] = useState(false);
  const [darkKingOnCheck, setDarkKingOnCheck] = useState(false);

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

    if (lightKingOnCheck || darkKingOnCheck) {
      const lightKing = pieces.find((p) => {
        return p.type === "king" && p.color === "light";
      });
      const darkKing = pieces.find((p) => {
        return p.type === "king" && p.color === "dark";
      });

      classname +=
        lightKingOnCheck &&
        lightKing.position.x === x &&
        lightKing.position.y === y
          ? " king-on-check"
          : "";

      classname +=
        darkKingOnCheck &&
        darkKing.position.x === x &&
        darkKing.position.y === y
          ? " king-on-check"
          : "";
    }

    return classname;
  };

  const handlePieceClick = (
    x,
    y,
    hasPiece,
    isPossibleMovement,
    isPossibleTake
  ) => {
    if (checkMate || staleMate) {
      return;
    }
    if (!hasPiece) {
      if (isPossibleMovement) {
        const tempPieces = movePiece([...pieces], selectedPiece, x, y);

        setPieces(tempPieces);
        setPosiblePieceMovements([]);

        //Revisar si el rey contrario quedó en jaque
        const tempKing = pieces.find((p) => {
          return p.type === "king" && p.color !== selectedPiece.color;
        });

        const kingOnCheck = !isKingOnCheck(
          pieces,
          tempKing.position,
          tempKing,
          darkOnTop
        );

        if (kingOnCheck) {
          if (tempKing.color === "light") {
            setLightKingOnCheck(true);
          } else {
            setDarkKingOnCheck(true);
          }
        } else {
          setLightKingOnCheck(false);
          setDarkKingOnCheck(false);
        }

        //Revisar si hay jaque mate o "stalemate"
        //Checar si hay algún movimiento de todas las piezas "amigas" del rey en jaque

        const friendlyPieces = tempPieces.filter(
          (p) => p.color === tempKing.color
        );

        var noMovesLeft = true;

        for (var i = 0; i < friendlyPieces.length; i++) {
          var friendlyPiece = friendlyPieces[i];

          var friendlyPieceMovements = getPieceMovements(
            friendlyPiece,
            friendlyPiece.position.x,
            friendlyPiece.position.y,
            tempPieces,
            darkOnTop,
            true
          );

          if (friendlyPieceMovements.length) {
            noMovesLeft = false;
            break;
          }
        }

        if (noMovesLeft) {
          if (kingOnCheck) {
            setCheckMate(true);
            setWinner(tempKing.color === "light" ? "dark" : "light");
          } else {
            setStaleMate(true);
          }
        }

        setSelectedPiece(null);
      }
      return;
    }

    const piece = pieces.find((p) => {
      return p.position.x === x && p.position.y === y;
    });

    // Checar si la tile con pieza es un possible movement && isTake===true
    if (isPossibleTake) {
      // Agregamos como captura la pieza clickeada
      darkOnTop
        ? piece.color === "dark"
          ? setCapturesBottom([...capturesBottom, piece])
          : setCapturesTop([...capturesTop, piece])
        : piece.color === "dark"
        ? setCapturesTop([...capturesTop, piece])
        : setCapturesBottom([...capturesBottom, piece]);

      var tempPieces = [...pieces];

      const tempPieceIndex = tempPieces.indexOf(piece);

      tempPieces.splice(tempPieceIndex, 1);

      tempPieces = movePiece(tempPieces, selectedPiece, x, y);

      setPieces(tempPieces);
      setPosiblePieceMovements([]);

      //Revisar si el rey contrario quedó en jaque
      const tempKing = pieces.find((p) => {
        return p.type === "king" && p.color !== selectedPiece.color;
      });

      const kingOnCheck = !isKingOnCheck(
        pieces,
        tempKing.position,
        tempKing,
        darkOnTop
      );

      if (kingOnCheck) {
        if (tempKing.color === "light") {
          setLightKingOnCheck(true);
        } else {
          setDarkKingOnCheck(true);
        }
      } else {
        setLightKingOnCheck(false);
        setDarkKingOnCheck(false);
      }

      //Revisar si hay jaque mate o "stalemate"
      //Checar si hay algún movimiento de todas las piezas "amigas" del rey en jaque

      const friendlyPieces = tempPieces.filter(
        (p) => p.color === tempKing.color
      );

      var noMovesLeft = true;

      for (var i = 0; i < friendlyPieces.length; i++) {
        var friendlyPiece = friendlyPieces[i];

        var friendlyPieceMovements = getPieceMovements(
          friendlyPiece,
          friendlyPiece.position.x,
          friendlyPiece.position.y,
          tempPieces,
          darkOnTop,
          true
        );

        if (friendlyPieceMovements.length) {
          noMovesLeft = false;
          break;
        }
      }

      if (noMovesLeft) {
        if (kingOnCheck) {
          setCheckMate(true);
          setWinner(tempKing.color === "light" ? "dark" : "light");
        } else {
          setStaleMate(true);
        }
      }

      setSelectedPiece(null);

      return;
    }

    setSelectedPiece(piece);

    var possibleMovements = [];

    switch (piece.type) {
      case "pawn":
        possibleMovements = getPawnMovements(
          piece,
          x,
          y,
          darkOnTop,
          pieces,
          true
        );
        break;
      case "knight":
        possibleMovements = getKnightMovements(
          piece,
          x,
          y,
          pieces,
          darkOnTop,
          true
        );
        break;
      case "king":
        possibleMovements = getKingMovements(
          piece,
          x,
          y,
          pieces,
          darkOnTop,
          true
        );
        break;
      case "rook":
        possibleMovements = getRookMovements(
          piece,
          x,
          y,
          pieces,
          darkOnTop,
          true
        );
        break;
      case "bishop":
        possibleMovements = getBishopMovements(
          piece,
          x,
          y,
          pieces,
          darkOnTop,
          true
        );
        break;
      case "queen":
        possibleMovements = getQueenMovements(
          piece,
          x,
          y,
          pieces,
          darkOnTop,
          true
        );
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

          const isPossibleTake = possiblePieceMovements.some((movement) => {
            return movement.x === x && movement.y === y && movement.isTake;
          });

          return (
            <div
              key={`p${x}${y}`}
              className={getTileClassname(x, y, hasPiece)}
              onClick={() =>
                handlePieceClick(
                  x,
                  y,
                  hasPiece,
                  isPossibleMovement,
                  isPossibleTake
                )
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
