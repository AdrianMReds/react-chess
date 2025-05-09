import "./game.css";
import { useParams } from "react-router-dom";
import Board from "./components/board";
import { useState } from "react";

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

  // console.log("capturesTop", capturesTop);
  // console.log("capturesBottom", capturesBottom);

  const numbers = defineNumbers(gametype);

  const color = gametype.split("_")[1];

  return (
    <div className="game">
      <div className="top">
        <h2>
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
        />
        <div className="history">
          <div>Historial</div>
        </div>
      </div>
      <div className="bottom">
        <div className="player-info">
          <h2>
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
