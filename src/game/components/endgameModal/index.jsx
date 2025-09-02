import "./endgameModal.css";
import { useNavigate } from "react-router-dom";

const EndgameModal = ({ checkMate, winner, numbers, player1, player2 }) => {
  const navigate = useNavigate();
  const darkOnTop = numbers[0] === "8";

  const winnerPlayer = darkOnTop
    ? winner === "dark"
      ? player2
      : player1
    : winner === "dark"
    ? player1
    : player2;

  return (
    <div className="modal">
      <h2>{checkMate ? "¡Jaque mate!" : "¡Empate!"}</h2>
      <p>
        {checkMate
          ? `El jugador "${winnerPlayer}" ha ganado la partida.`
          : "Los jugadores han empatado."}
      </p>
      <button onClick={() => navigate("/")}>Regresar a menú</button>
    </div>
  );
};

export default EndgameModal;
