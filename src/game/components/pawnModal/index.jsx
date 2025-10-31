import React from "react";
import "./pawnModal.css";

const PawnModal = ({ color, x, y, convertPawn }) => {
  return (
    <div
      className="pawn-modal"
      style={{
        left: `calc(calc(80vh/8)*${x})`,
        bottom: y === 6 ? 0 : undefined,
      }}
    >
      <div
        className={`${color}-queen square`}
        onClick={() => {
          convertPawn("queen");
        }}
      >
        .
      </div>
      <div
        className={`${color}-rook square`}
        onClick={() => {
          convertPawn("rook");
        }}
      >
        .
      </div>
      <div
        className={`${color}-bishop square`}
        onClick={() => {
          convertPawn("bishop");
        }}
      >
        .
      </div>
      <div
        className={`${color}-knight square`}
        onClick={() => {
          convertPawn("knight");
        }}
      >
        .
      </div>
    </div>
  );
};

export default PawnModal;
