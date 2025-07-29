import "./game.css";
import { useParams } from "react-router-dom";
import Board from "./components/board";
import { useState } from "react";
import EndgameModal from "./components/endgameModal";

const types = ["pawn", "knight", "bishop", "rook", "queen"];

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

const Game = () => {
  const { gametype, player1, player2, difficulty } = useParams();

  const [capturesTop, setCapturesTop] = useState([]);
  const [capturesBottom, setCapturesBottom] = useState([]);

  const [checkMate, setCheckMate] = useState(false);
  const [staleMate, setStaleMate] = useState(false);
  const [winner, setWinner] = useState("");

  const [turn, setTurn] = useState("light");

  const [history, setHistory] = useState([]);

  const numbers = defineNumbers(gametype);

  const color = gametype.split("_")[1];

  const darkOnTop = numbers[0] === "8";

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
