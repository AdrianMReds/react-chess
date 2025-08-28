import "./menu.css";
import { Button, message } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { defineNumbers } from "../game";
import { defineInitialPositions } from "../constants";

// TODO: Agregar jugar al dar click a Enter
const Menu = () => {
  const [gametype, setGametype] = useState("two-players");
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [color, setColor] = useState("white");
  const [configuration, setConfiguration] = useState({});
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const tempConfiguration = JSON.parse(
      localStorage.getItem(`${gametype}_${color}`)
    );

    setConfiguration(tempConfiguration);
  }, [gametype, color]);

  const newGame = () => {
    const newConfiguration = {
      pieces: defineInitialPositions(defineNumbers(`${gametype}_${color}`)),
      history: [],
      player1: player1,
      player2: player2,
      capturesTop: [],
      capturesBottom: [],
      gametype: gametype,
      difficulty: difficulty,
      turn: "light",
      isNew: true,
      lightKingOnCheck: false,
      darkKingOnCheck: false,
    };

    localStorage.setItem(
      `${gametype}_${color}`,
      JSON.stringify(newConfiguration)
    );

    navigate(
      `/game/${gametype}_${color}/${player1}/${
        gametype == "two-players" ? player2 : "default"
      }/${gametype === "two-players" ? "default" : difficulty}`
    );
  };

  const handlePlay = (isNewGame) => {
    if (gametype === "two-players" && (!player1 || !player2) && isNewGame) {
      messageApi.open({
        type: "error",
        content: "Por favor ingresa el nombre de ambos jugadores",
      });
      return;
    } else if (gametype === "ai" && !player1 && isNewGame) {
      messageApi.open({
        type: "error",
        content: "Por favor ingresa el nombre del jugador",
      });
      return;
    } else {
      if (isNewGame) {
        newGame();
      } else {
        navigate(
          `/game/${gametype}_${color}/${configuration.player1}/${
            gametype == "two-players" ? configuration.player2 : "default"
          }/${
            gametype === "two-players" ? "default" : configuration.difficulty
          }`
        );
      }
    }
  };

  return (
    <div className="menu-container">
      {contextHolder}
      <div className="menu">
        <h2>Menú</h2>
        <div className="buttons">
          <Button
            type={gametype === "two-players" ? "primary" : "default"}
            onClick={() => {
              setGametype("two-players");
              setColor("white");
            }}
          >
            2 Jugadores
          </Button>
          <Button
            type={gametype !== "two-players" ? "primary" : "default"}
            onClick={() => setGametype("ai")}
          >
            Vs IA
          </Button>
        </div>

        <h3>Nombre jugador 1</h3>
        <input
          type="text"
          placeholder="Ingresa el nombre del jugador 1"
          onChange={(e) => setPlayer1(e.target.value)}
        />

        {gametype === "two-players" ? (
          <>
            <h3>Nombre jugador 2</h3>
            <input
              type="text"
              placeholder="Ingresa el nombre del jugador 2"
              onChange={(e) => setPlayer2(e.target.value)}
            />
          </>
        ) : (
          <>
            <h3>Dificultad</h3>
            <div className="buttons">
              <Button
                type={difficulty === "easy" ? "primary" : "default"}
                onClick={() => setDifficulty("easy")}
              >
                Fácil
              </Button>
              <Button
                type={difficulty === "medium" ? "primary" : "default"}
                onClick={() => setDifficulty("medium")}
              >
                Medio
              </Button>
              <Button
                type={difficulty === "hard" ? "primary" : "default"}
                onClick={() => setDifficulty("hard")}
              >
                Difícil
              </Button>
            </div>

            <h3>Color de piezas</h3>
            <div className="buttons">
              <Button
                type={color === "white" ? "primary" : "default"}
                onClick={() => setColor("white")}
              >
                Blancas
              </Button>
              <Button
                type={color !== "white" ? "primary" : "default"}
                onClick={() => setColor("black")}
              >
                Negras
              </Button>
            </div>
          </>
        )}

        {configuration.isNew ? (
          <Button className="play-btn" onClick={() => handlePlay(true)}>
            Jugar
          </Button>
        ) : (
          <div className="play-btns">
            <Button className="play-btn" onClick={() => handlePlay(false)}>
              Continuar juego
            </Button>
            <Button className="play-btn" onClick={() => handlePlay(true)}>
              Juego nuevo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
