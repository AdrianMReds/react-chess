import "./game.css";
import { useParams } from "react-router-dom";
import Board from "./components/board";
import { useState, useEffect, act } from "react";
import EndgameModal from "./components/endgameModal";

import { validateMovement, movePiece, isKingOnCheck, getPieceMovements } from "./components/board/movements";
import { createMovement } from "../openai";

import { tempPieces, tempHistory } from "../constants.js";

const types = ["pawn", "knight", "bishop", "rook", "queen"];

//TODO: Cuando jugamos con las negras vs IA no se cambia el turno en localStorage

const defineNumbers = (gametype) => {
  const gametypeArray = gametype.split("_");

  if (gametypeArray[0] === "ai") {
    if (gametypeArray[1] === "white") {
      return ["8", "7", "6", "5", "4", "3", "2", "1"];
    }
    return ["1", "2", "3", "4", "5", "6", "7", "8"];
  }
  return ["8", "7", "6", "5", "4", "3", "2", "1"];
};

const getImage = (type, color) => {
    var imageString;

    switch (type) {
      case "queen":
        imageString = `q${color.charAt(0)}.png`;
        break;

      case "rook":
        imageString = `r${color.charAt(0)}.png`;
        break;

      case "bishop":
        imageString = `b${color.charAt(0)}.png`;
        break;

      case "knight":
        imageString = `n${color.charAt(0)}.png`;
        break;

      default:
        imageString = `p${color.charAt(0)}.png`;
        break;
    }

    return imageString;
  };

const Game = () => {
  const { gametype, player1, player2, difficulty } = useParams();

  const [pieces, setPieces] = useState([]);
  const [capturesTop, setCapturesTop] = useState([]);
  const [capturesBottom, setCapturesBottom] = useState([]);
  const [lightKingOnCheck, setLightKingOnCheck] = useState(false);
  const [darkKingOnCheck, setDarkKingOnCheck] = useState(false);

  const [checkMate, setCheckMate] = useState(false);
  const [staleMate, setStaleMate] = useState(false);
  const [winner, setWinner] = useState("");

  const [turn, setTurn] = useState("light");

  const [history, setHistory] = useState([]);

  const numbers = defineNumbers(gametype);

  const gametypeName = gametype.split("_")[0];

  const color = gametype.split("_")[1];

  const darkOnTop = numbers[0] === "8";
  // const darkOnTop = false;

  const saveGame = (
    pieces,
    newHistory,
    newCapturesBottom,
    newCapturesTop,
    lightKingOnCheck,
    darkKingOnCheck,
    tempCheckmate,
    tempStalemate,
    tempWinner
  ) => {
    /*
    Keys:
    "ai_<color>", "two-players_<color>"
    */

    const gameConfiguration = {
      pieces: pieces,
      history: newHistory,
      player1: player1,
      player2: player2,
      capturesTop: newCapturesTop,
      capturesBottom: newCapturesBottom,
      gametype: gametype,
      difficulty: difficulty,
      turn: turn === "light" ? "dark" : "light",
      isNew: false,
      lightKingOnCheck: lightKingOnCheck,
      darkKingOnCheck: darkKingOnCheck,
      checkmate: tempCheckmate,
      stalemate: tempStalemate,
      winner: tempWinner,
    };

    localStorage.setItem(gametype, JSON.stringify(gameConfiguration));
  };

   const getNewHistory = (piece, movementString, actualHistory=null) => {
    var tempHistory = actualHistory ? [...actualHistory] : [...history];

    if (piece.color === "light") {
      tempHistory.push({ light: movementString });
    } else {
      tempHistory[tempHistory.length - 1].dark = movementString; //-> {*}
    }

    return tempHistory;
  };

  const getLastMovement = (newHistory = history) => {
    if (!newHistory.length) {
      return "";
    }

    const lastTurn = newHistory[newHistory.length - 1];

    return lastTurn.dark ? lastTurn.dark : lastTurn.light;
  };

  // Para probar el checkmate y stalemte ay que usar un tablero fijo como tempPieces
  const generateAIMovement = async (newHistory, tempPieces) => {
    // TODO: Ver tema de conversión de peones con IA
    let isValid = false;
    let regenerate = false;
    let lastGeneratedMovement;
    
    do{
      var newMovement = await createMovement(
      difficulty,
      newHistory,
      color === "white" ? "dark" : "light",
      regenerate
      ); 

      var validation = validateMovement(
        tempPieces,
        newMovement.pieza,
        newMovement.movimiento,
        darkOnTop,
        getLastMovement(newHistory)
      );

      isValid = validation.isValid;
      regenerate = true;
      lastGeneratedMovement = newMovement;
    }while(!isValid)

    var currentPieceX = validation.piece.position.x;
      
    var capturedPiece = tempPieces.find((p) => {
      return p.position.x === validation.movement.x && p.position.y === validation.movement.y;
    });

    var aiTempPieces = movePiece(tempPieces, validation.piece, validation.movement.x, validation.movement.y, validation.isTake);

    if(validation.isCastle){
      if (currentPieceX === 4){
        var rookToCastle = aiTempPieces.find((p) => {
          return p.type === "rook" && p.color === validation.piece.color && p.position.x === (newMovement.movimiento.length > 3 ? 0 : 7);
        })
        //MovePiece de rookToCastle
          if(rookToCastle.position.x === 0){
            var aiTempPieces = movePiece(aiTempPieces, rookToCastle, 3, rookToCastle.position.y, false);
          }else{
            var aiTempPieces = movePiece(aiTempPieces, rookToCastle, 5, rookToCastle.position.y, false);
          }
      }else{
        var rookToCastle = aiTempPieces.find((p) => {
          return p.type === "rook" && p.color === validation.piece.color && p.position.x === (newMovement.movimiento.length > 3 ? 7 : 0);
      })
      if(rookToCastle.position.x === 0){
          var aiTempPieces = movePiece(aiTempPieces, rookToCastle, 2, rookToCastle.position.y, false);
        }else{
          var aiTempPieces = movePiece(aiTempPieces, rookToCastle, 4, rookToCastle.position.y, false);
        }
    }}

    if(validation.conversionType){
      let pieceType;

      switch(validation.conversionType){
        case "Q":
          pieceType = "queen";
          break;
        case "R":
          pieceType = "rook";
          break;
        case "B":
          pieceType = "bishop";
          break;
        case "N":
          pieceType = "knight";
          break;
        default:
          pieceType = "queen";
          break;
      }

      //Cambiamos el peón a la otra pieza
      const pieceToChange = aiTempPieces.find((p) => {
        return p.name === validation.piece.name;
      });

      const pieceToChangeIndex = aiTempPieces.indexOf(pieceToChange);
      var nameNum = 0;

      aiTempPieces.forEach((p) => {
        if (p.type === pieceType && p.color === validation.piece.color) {
          nameNum++;
        }
      });

      aiTempPieces[pieceToChangeIndex] = {
      ...pieceToChange,
      name: `${
        validation.piece.color
      }${pieceType[0].toUpperCase()}${pieceType.slice(1)}${nameNum + 1}`,
      type: pieceType,
      image: getImage(pieceType, validation.piece.color),
    };
    }

    var aiNewHistory = getNewHistory(validation.piece, newMovement.movimiento, newHistory);

    setHistory(aiNewHistory);

    // Registrar captures
    if(validation.isTake){
      //Es en pasant
      if(validation.piece.type === "pawn" && !capturedPiece){
          capturedPiece = aiTempPieces.find((p) => {
            return p.position.x === validation.movement.x && p.position.y ===       validation.movement.y - 1;
      });

        const aiTempPieceIndex = aiTempPieces.indexOf(capturedPiece);
        aiTempPieces.splice(aiTempPieceIndex, 1);
      }
      var newCapturesTop = [...capturesTop, capturedPiece];
      setCapturesTop(newCapturesTop);
      }

    // Registrar jaque
    const tempKing = tempPieces.find((p) => {
        return p.type === "king" && p.color !== validation.piece.color;
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



    setPieces(aiTempPieces);
    setTurn(color === "white" ? "light" : "dark");
    
    // Registrar jaque mate o stalemate
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

    //Save game after AI move

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
  };

  useEffect(() => {
    const actualConfiguration = JSON.parse(localStorage.getItem(gametype));
    
    if (
      actualConfiguration.gametype === "ai" &&
      actualConfiguration.isNew &&
      color === "black"
    ) {
      // Empieza la IA
      generateAIMovement([], actualConfiguration.pieces);
    }

    //Asignar todo a como está la configuración
    setHistory(actualConfiguration.history);
    // setHistory(tempHistory);
    setCapturesTop(actualConfiguration.capturesTop);
    setCapturesBottom(actualConfiguration.capturesBottom);
    setTurn(actualConfiguration.turn);
    setPieces(actualConfiguration.pieces);
    // setPieces(tempPieces);
    setLightKingOnCheck(actualConfiguration.lightKingOnCheck);
    setDarkKingOnCheck(actualConfiguration.darkKingOnCheck);
    setCheckMate(actualConfiguration.checkmate);
    setStaleMate(actualConfiguration.stalemate);
    setWinner(actualConfiguration.winner);
  }, []);

  return (
    <div className="game">
      <div className="top">
        {/* TODO: Que no salga un turno cuando se acabe el juego */}
        {/* TODO: Cuando seleccionamos ser las negras el nombre se pone arriba */}
        <h2
          className={
            darkOnTop
              ? turn === "dark"
                ? "turn"
                : ""
              : turn === "light"
              ? "turn"
              : ""
          }
        >
          {gametype === "two-players"
            ? player2
            : color === "white"
            ? player2
            : player1}
        </h2>
        {/* TODO: Ver si ponemos outline a imagenes de captures negras */}
        <div className="captures">
          {types.map((type) => {
            const tempTypeList = capturesTop.filter((capture) => {
              return capture.type === type;
            });
            // Si hay al menos una pieza -> 5vh + 10px por cada pieza extra
            var extraWidth = 0;

            if (tempTypeList.length > 1) {
              extraWidth += 10 * (tempTypeList.length - 1);
            }

            return (
              <div
                key={type}
                id={`topCaptured${type}`}
                style={{
                  width: tempTypeList.length
                    ? `calc(5vh + ${extraWidth}px)`
                    : undefined,
                }}
              >
                {tempTypeList.map((piece, idx) => {
                  return (
                    <img
                      style={{
                        position: "absolute",
                        bottom: 2,
                        left: 10 * idx,
                      }}
                      key={piece.name}
                      src={`/${piece.image}`}
                      alt={piece.name}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <div className="details">
        <Board
          pieces={pieces}
          setPieces={setPieces}
          numbers={numbers}
          capturesTop={capturesTop}
          setCapturesTop={setCapturesTop}
          capturesBottom={capturesBottom}
          setCapturesBottom={setCapturesBottom}
          checkMate={checkMate}
          setCheckMate={setCheckMate}
          staleMate={staleMate}
          setStaleMate={setStaleMate}
          winner={winner}
          setWinner={setWinner}
          turn={turn}
          setTurn={setTurn}
          history={history}
          setHistory={setHistory}
          saveGame={saveGame}
          lightKingOnCheck={lightKingOnCheck}
          setLightKingOnCheck={setLightKingOnCheck}
          darkKingOnCheck={darkKingOnCheck}
          setDarkKingOnCheck={setDarkKingOnCheck}
          gametypeName={gametypeName}
          color={color === "white" ? "light" : "dark"}
          difficulty={difficulty}
          getNewHistory={getNewHistory}
          getLastMovement={getLastMovement}
          generateAIMovement={generateAIMovement}
        />
        <div className="history">
          <div>
            <h2>Historial</h2>
            {history.map((turn, idx) => {
              return (
                <div className={`row ${idx % 2 == 0 ? "dark" : "light"}`}>
                  <div>{idx + 1}.</div>
                  <div>{turn.light}</div>
                  <div>{turn.dark}</div>
                </div>
              );
            })}
          </div>
          {(checkMate || staleMate) && (
            <EndgameModal
              checkMate={checkMate}
              winner={winner}
              numbers={numbers}
              player1={player1}
              player2={player2}
            />
          )}
        </div>
      </div>
      <div className="bottom">
        <div className="player-info">
          <h2
            className={
              turn && darkOnTop
                ? turn === "dark"
                  ? ""
                  : "turn"
                : turn === "light"
                ? ""
                : "turn"
            }
          >
            {gametype === "two-players"
              ? player1
              : color === "white"
              ? player1
              : player2}
          </h2>
          <div className="captures">
            {types.map((type) => {
              const tempTypeList = capturesBottom.filter((capture) => {
                return capture.type === type;
              });
              // Si hay al menos una pieza -> 5vh + 10px por cada pieza extra
              var extraWidth = 0;

              if (tempTypeList.length > 1) {
                extraWidth += 10 * (tempTypeList.length - 1);
              }

              return (
                <div
                  key={type}
                  id={`bottomCaptured${type}`}
                  style={{
                    width: tempTypeList.length
                      ? `calc(5vh + ${extraWidth}px)`
                      : undefined,
                  }}
                >
                  {tempTypeList.map((piece, idx) => {
                    return (
                      <img
                        style={{
                          position: "absolute",
                          bottom: 2,
                          left: 10 * idx,
                        }}
                        key={piece.name}
                        src={`/${piece.image}`}
                        alt={piece.name}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div className="buttons-game">
          <button>Menu</button>
        </div>
      </div>
    </div>
  );
};

export default Game;

export { defineNumbers, getImage };
