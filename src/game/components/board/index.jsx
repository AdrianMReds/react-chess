import "./board.css";
import { useState, useEffect } from "react";

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
  getMovementsInCommon,
  getMovementString,
} from "./movements";
import PawnModal from "../pawnModal";
import { getImage } from "../../../game"

const Board = ({
  pieces,
  setPieces,
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
  turn,
  setTurn,
  history,
  setHistory,
  saveGame,
  lightKingOnCheck,
  setLightKingOnCheck,
  darkKingOnCheck,
  setDarkKingOnCheck,
  gametypeName,
  color,
  difficulty,
  getNewHistory,
  getLastMovement,
  generateAIMovement,
}) => {
  const darkOnTop = numbers[0] === "8";

  const letters = darkOnTop
    ? ["a", "b", "c", "d", "e", "f", "g", "h"]
    : ["h", "g", "f", "e", "d", "c", "b", "a"];

  const [openPawnModal, setOpenPawnModal] = useState({
    open: false,
    coords: {},
    type: "",
  });

  const [possiblePieceMovements, setPosiblePieceMovements] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [lastCoordinates, setLastCoordinates] = useState({});

  useEffect(() => {
    if (selectedPiece) {
      var x = selectedPiece.position.x;
      var y = selectedPiece.position.y;
      setLastCoordinates({ x, y });
    }
  }, [selectedPiece]);

  const convertPawn = (pieceType) => {
    var tempPieces;
    //Hacemos move o take
    if (openPawnModal.type === "movement") {
      tempPieces = movePiece(
        [...pieces],
        selectedPiece,
        openPawnModal.coords.x,
        openPawnModal.coords.y
      );
    } else {
      const piece = pieces.find((p) => {
        return (
          p.position.x === openPawnModal.coords.x &&
          p.position.y === openPawnModal.coords.y
        );
      });
      tempPieces = [...pieces];

      const tempPieceIndex = tempPieces.indexOf(piece);

      tempPieces.splice(tempPieceIndex, 1);

      tempPieces = movePiece(
        tempPieces,
        selectedPiece,
        openPawnModal.coords.x,
        openPawnModal.coords.y
      );

      //Agregar lógica de capturas
      darkOnTop
        ? piece.color === "dark"
          ? setCapturesBottom([...capturesBottom, piece])
          : setCapturesTop([...capturesTop, piece])
        : piece.color === "dark"
        ? setCapturesTop([...capturesTop, piece])
        : setCapturesBottom([...capturesBottom, piece]);
    }

    //Cambiamos el peón a la otra pieza
    const pieceToChange = tempPieces.find((p) => {
      return p.name === selectedPiece.name;
    });

    const pieceToChangeIndex = tempPieces.indexOf(pieceToChange);

    // tempPieces[pieceToChangeIndex].name = "...";
    // tempPieces[pieceToChangeIndex].type = "...";
    // tempPieces[pieceToChangeIndex].image = "/...";

    var nameNum = 0;

    tempPieces.forEach((p) => {
      if (p.type === pieceType && p.color === selectedPiece.color) {
        nameNum++;
      }
    });

    tempPieces[pieceToChangeIndex] = {
      ...pieceToChange,
      name: `${
        selectedPiece.color
      }${pieceType[0].toUpperCase()}${pieceType.slice(1)}${nameNum + 1}`,
      type: pieceType,
      image: getImage(pieceType, selectedPiece.color),
    };

    setPieces(tempPieces);
    setPosiblePieceMovements([]);

    const tempKing = pieces.find((p) => {
      return p.type === "king" && p.color !== selectedPiece.color;
    });

    var tempLightCheck = false;
    var tempDarkCheck = false;

    const kingOnCheck = !isKingOnCheck(
      tempPieces,
      tempKing.position,
      tempKing,
      darkOnTop
    );

    if (kingOnCheck) {
      if (tempKing.color === "light") {
        setLightKingOnCheck(true);
        tempLightCheck = true;
      } else {
        setDarkKingOnCheck(true);
        tempDarkCheck = true;
      }
    } else {
      setLightKingOnCheck(false);
      setDarkKingOnCheck(false);
      tempLightCheck = false;
      tempDarkCheck = false;
    }

    const movementString = getMovementString(
      selectedPiece,
      pieces,
      openPawnModal.coords.x,
      openPawnModal.coords.y,
      openPawnModal.type === "take",
      kingOnCheck,
      false,
      lastCoordinates,
      darkOnTop,
      pieceType
    );

    const newHistory = getNewHistory(selectedPiece, movementString);
    setHistory(newHistory);

    const friendlyPieces = tempPieces.filter((p) => p.color === tempKing.color);

    var noMovesLeft = true;

    for (var i = 0; i < friendlyPieces.length; i++) {
      var friendlyPiece = friendlyPieces[i];

      var friendlyPieceMovements = getPieceMovements(
        friendlyPiece,
        friendlyPiece.position.x,
        friendlyPiece.position.y,
        tempPieces,
        darkOnTop,
        true,
        getLastMovement()
      );

      if (friendlyPieceMovements.length) {
        noMovesLeft = false;
        break;
      }
    }

    var tempCheckmate = false;
    var tempStalemate = false;
    var tempWinner = "";

    if (noMovesLeft) {
      if (kingOnCheck) {
        tempCheckmate = true;
        tempWinner = tempKing.color === "light" ? "dark" : "light";
        setCheckMate(true);
        setWinner(tempKing.color === "light" ? "dark" : "light");
      } else {
        tempStalemate = true;
        setStaleMate(true);
      }
      setTurn("");
    }

    setSelectedPiece(null);

    if (turn === "light") {
      setTurn("dark");
    } else {
      setTurn("light");
    }

    saveGame(
      tempPieces,
      newHistory,
      capturesBottom,
      capturesTop,
      tempLightCheck,
      tempDarkCheck,
      tempCheckmate,
      tempStalemate,
      tempWinner
    );

    //Reiniciamos el state de openPawnModal
    setOpenPawnModal({
      open: false,
      coords: {},
      type: "",
    });
  };

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

  const handlePieceClick = async (
    x,
    y,
    hasPiece,
    isPossibleMovement,
    isPossibleTake,
    isCastle
  ) => {
    if (checkMate || staleMate) {
      return;
    }

    if (gametypeName === "ai" && turn !== color) {
      return;
    }

    setOpenPawnModal({ open: false, coords: {} });

    if (!hasPiece) {
      // POSSIBLE MOVEMENT -------------------
      if (isPossibleMovement) {
        var pieceCommonMovements = [];

        // Conversión de peones
        if (selectedPiece.type === "pawn" && (y === 0 || y === 7)) {
          setOpenPawnModal({ open: true, coords: { x, y }, type: "movement" });
          return;
        }

        if (selectedPiece.type === "knight" || selectedPiece.type === "rook") {
          const commonPiece = pieces.find((p) => {
            return (
              p.type === selectedPiece.type &&
              p.color === selectedPiece.color &&
              p.name !== selectedPiece.name
            );
          });

          if (commonPiece) {
            pieceCommonMovements = getMovementsInCommon(
              possiblePieceMovements,
              commonPiece,
              pieces,
              darkOnTop,
              true
            );
          }
        }

        var isCommon = false;

        if (
          pieceCommonMovements.some((movement) => {
            return movement.x === x && movement.y === y;
          })
        ) {
          isCommon = true;
        }

        var tempPieces = movePiece([...pieces], selectedPiece, x, y);

        //ENROQUE
        //Revisar si se mueve a la derecha son 3 y a la izquierda son 2
        //Revisar generación de string de movimiento
        var castleDirection;
        if (isCastle) {
          //A la derecha
          if (lastCoordinates.x < x) {
            const rookToMove = pieces.find((p) => {
              return (
                p.color === selectedPiece.color &&
                p.type === "rook" &&
                p.position.x === 7 &&
                p.position.y === selectedPiece.position.y
              );
            });
            tempPieces = movePiece(
              [...pieces],
              rookToMove,
              5,
              rookToMove.position.y
            );
            castleDirection = "short";
          } else {
            //A la izquierda
            const rookToMove = pieces.find((p) => {
              return (
                p.color === selectedPiece.color &&
                p.type === "rook" &&
                p.position.x === 0 &&
                p.position.y === selectedPiece.position.y
              );
            });
            tempPieces = movePiece(
              [...pieces],
              rookToMove,
              3,
              rookToMove.position.y
            );
            castleDirection = "long";
          }
        }

        // EN PASANT
        if (isPossibleTake) {
          var removedPiece = {};

          // Si la pieza va hacia arriba
          if (
            (darkOnTop && selectedPiece.color === "light") ||
            (!darkOnTop && selectedPiece.color === "dark")
          ) {
            removedPiece = pieces.find((p) => {
              return p.position.x === x && p.position.y === y + 1;
            });
          }

          //Si la pieza va hacia abajo
          if (
            (!darkOnTop && selectedPiece.color === "light") ||
            (darkOnTop && selectedPiece.color === "dark")
          ) {
            removedPiece = pieces.find((p) => {
              return p.position.x === x && p.position.y === y - 1;
            });
          }

          const tempPieceIndex = tempPieces.indexOf(removedPiece);

          tempPieces.splice(tempPieceIndex, 1);
        }

        setPieces(tempPieces);
        setPosiblePieceMovements([]);

        //Revisar si el rey contrario quedó en jaque
        const tempKing = pieces.find((p) => {
          return p.type === "king" && p.color !== selectedPiece.color;
        });

        var tempLightCheck = false;
        var tempDarkCheck = false;

        const kingOnCheck = !isKingOnCheck(
          pieces,
          tempKing.position,
          tempKing,
          darkOnTop
        );

        if (kingOnCheck) {
          if (tempKing.color === "light") {
            setLightKingOnCheck(true);
            tempLightCheck = true;
          } else {
            setDarkKingOnCheck(true);
            tempDarkCheck = true;
          }
        } else {
          setLightKingOnCheck(false);
          setDarkKingOnCheck(false);
          tempLightCheck = false;
          tempDarkCheck = false;
        }

        var movementString;

        if (isCastle) {
          movementString = castleDirection === "short" ? "O-O" : "O-O-O";
        } else {
          movementString = getMovementString(
            selectedPiece,
            pieces,
            x,
            y,
            isPossibleTake,
            kingOnCheck,
            isCommon,
            lastCoordinates,
            darkOnTop
          );
        }

        //Si se movió uno blanco creamos un objeto en el arreglo
        //Si se movió uno negro agregamos el movimiento al objeto
        const newHistory = getNewHistory(selectedPiece, movementString);
        setHistory(newHistory);

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
            true,
            getLastMovement()
          );

          if (friendlyPieceMovements.length) {
            noMovesLeft = false;
            break;
          }
        }

        var tempCheckmate = false;
        var tempStalemate = false;
        var tempWinner = "";

        if (noMovesLeft) {
          if (kingOnCheck) {
            tempCheckmate = true;
            tempWinner = tempKing.color === "light" ? "dark" : "light";
            setCheckMate(true);
            setWinner(tempKing.color === "light" ? "dark" : "light");
          } else {
            tempStalemate = true;
            setStaleMate(true);
          }
          setTurn("");
        }

        setSelectedPiece(null);

        if (turn === "light") {
          setTurn("dark");
        } else {
          setTurn("light");
        }

        //Save game de possible movement
        saveGame(
          tempPieces,
          newHistory,
          capturesBottom,
          capturesTop,
          tempLightCheck,
          tempDarkCheck,
          tempCheckmate,
          tempStalemate,
          tempWinner
        );

        if(gametypeName === "ai"){
          generateAIMovement(newHistory, tempPieces);
        }
        
      }
      return;
    }

    const piece = pieces.find((p) => {
      return p.position.x === x && p.position.y === y;
    });

    // Checar si la tile con pieza es un possible movement && isTake===true
    //POSSIBLE TAKE ---------------------------------
    // TODO: Cuando un rey está en jaque, si en el movimiento que lo quitamos de jaque ponemos en jaque al otro fallan los cuadritos rojos
    if (isPossibleTake) {
      var pieceCommonMovements = [];

      // Conversión de peones
      if (selectedPiece.type === "pawn" && (y === 0 || y === 7)) {
        setOpenPawnModal({ open: true, coords: { x, y }, type: "take" });
        return;
      }

      if (selectedPiece.type === "knight" || selectedPiece.type === "rook") {
        const commonPiece = pieces.find((p) => {
          return (
            p.type === selectedPiece.type &&
            p.color === selectedPiece.color &&
            p.name !== selectedPiece.name
          );
        });

        if (commonPiece) {
          pieceCommonMovements = getMovementsInCommon(
            possiblePieceMovements,
            commonPiece,
            pieces,
            darkOnTop,
            true
          );
        }
      }

      var isCommon = false;

      if (
        pieceCommonMovements.some((movement) => {
          return movement.x === x && movement.y === y;
        })
      ) {
        isCommon = true;
      }

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

      var tempLightCheck = false;
      var tempDarkCheck = false;

      const kingOnCheck = !isKingOnCheck(
        pieces,
        tempKing.position,
        tempKing,
        darkOnTop
      );

      if (kingOnCheck) {
        if (tempKing.color === "light") {
          setLightKingOnCheck(true);
          tempLightCheck = true;
        } else {
          setDarkKingOnCheck(true);
          tempDarkCheck = true;
        }
      } else {
        setLightKingOnCheck(false);
        setDarkKingOnCheck(false);
        tempLightCheck = false;
        tempDarkCheck = false;
      }

      const movementString = getMovementString(
        selectedPiece,
        pieces,
        x,
        y,
        isPossibleTake,
        kingOnCheck,
        isCommon,
        lastCoordinates,
        darkOnTop
      );

      //Si se movió uno blanco creamos un objeto en el arreglo
      //Si se movió uno negro agregamos el movimiento al objeto
      const newHistory = getNewHistory(selectedPiece, movementString);
      setHistory(newHistory);

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

      var tempCheckmate = false;
      var tempStalemate = false;
      var tempWinner = "";

      if (noMovesLeft) {
        if (kingOnCheck) {
          tempCheckmate = true;
          tempWinner = tempKing.color === "light" ? "dark" : "light";
          setCheckMate(true);
          setWinner(tempKing.color === "light" ? "dark" : "light");
        } else {
          tempStalemate = true;
          setStaleMate(true);
        }
        setTurn("");
      }

      setSelectedPiece(null);

      if (turn === "light") {
        setTurn("dark");
      } else {
        setTurn("light");
      }

      var newCapturesBottom = darkOnTop
        ? piece.color === "dark"
          ? [...capturesBottom, piece]
          : capturesBottom
        : piece.color === "dark"
        ? capturesBottom
        : [...capturesBottom, piece];

      var newCapturesTop = darkOnTop
        ? piece.color === "dark"
          ? capturesTop
          : [...capturesTop, piece]
        : piece.color === "dark"
        ? [...capturesTop, piece]
        : capturesTop;

      //Save game de possible take
      saveGame(
        tempPieces,
        newHistory,
        newCapturesBottom,
        newCapturesTop,
        tempLightCheck,
        tempDarkCheck,
        tempCheckmate,
        tempStalemate,
        tempWinner
      );

      if(gametypeName === "ai"){
        generateAIMovement(newHistory, tempPieces);
      }

      return;
    }

    // Si no es el turno de la pieza
    if (piece.color !== turn) {
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
          true,
          getLastMovement()
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

          //Definir isCastle
          const isCastle = possiblePieceMovements.some((movement) => {
            return movement.x === x && movement.y === y && movement.isCastle;
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
                  isPossibleTake,
                  isCastle
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
              {isPossibleMovement && (
                <div
                  className={isPossibleTake ? "take-icon" : "movement-icon"}
                ></div>
              )}
            </div>
          );
        });
      })}
      {openPawnModal.open && (
        <PawnModal
          color={selectedPiece.color}
          x={selectedPiece.position.x}
          y={selectedPiece.position.y}
          convertPawn={convertPawn}
        />
      )}
    </div>
  );
};

export default Board;