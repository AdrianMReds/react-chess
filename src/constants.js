const defineInitialPositions = (numbers) => {
  const darkOnTop = numbers[0] === "8";

  const darkPieces = [
    {
      name: "darkRook1",
      position: darkOnTop ? { x: 0, y: 0 } : { x: 7, y: 0 },
      color: "dark",
      image: "rd.png",
      movements: [],
    },
    {
      name: "darkKnight1",
      position: darkOnTop ? { x: 0, y: 1 } : { x: 7, y: 1 },
      color: "dark",
      image: "nd.png",
      movements: [],
    },
    {
      name: "darkBishop1",
      position: darkOnTop ? { x: 0, y: 2 } : { x: 7, y: 2 },
      color: "dark",
      image: "bd.png",
      movements: [],
    },
    {
      name: "darkQueen",
      position: darkOnTop ? { x: 0, y: 3 } : { x: 7, y: 4 },
      color: "dark",
      image: "qd.png",
      movements: [],
    },
    {
      name: "darkKing",
      position: darkOnTop ? { x: 0, y: 4 } : { x: 7, y: 3 },
      color: "dark",
      image: "kd.png",
      movements: [],
    },
    {
      name: "darkBishop2",
      position: darkOnTop ? { x: 0, y: 5 } : { x: 7, y: 5 },
      color: "dark",
      image: "bd.png",
      movements: [],
    },
    {
      name: "darkKnight2",
      position: darkOnTop ? { x: 0, y: 6 } : { x: 7, y: 6 },
      color: "dark",
      image: "nd.png",
      movements: [],
    },
    {
      name: "darkRook2",
      position: darkOnTop ? { x: 0, y: 7 } : { x: 7, y: 7 },
      color: "dark",
      image: "rd.png",
      movements: [],
    },

    // Peones dark
    {
      name: "darkPawn1",
      position: darkOnTop ? { x: 1, y: 0 } : { x: 6, y: 0 },
      color: "dark",
      image: "pd.png",
      movements: [],
    },
    {
      name: "darkPawn2",
      position: darkOnTop ? { x: 1, y: 1 } : { x: 6, y: 1 },
      color: "dark",
      image: "pd.png",
      movements: [],
    },
    {
      name: "darkPawn3",
      position: darkOnTop ? { x: 1, y: 2 } : { x: 6, y: 2 },
      color: "dark",
      image: "pd.png",
      movements: [],
    },
    {
      name: "darkPawn4",
      position: darkOnTop ? { x: 1, y: 3 } : { x: 6, y: 3 },
      color: "dark",
      image: "pd.png",
      movements: [],
    },
    {
      name: "darkPawn5",
      position: darkOnTop ? { x: 1, y: 4 } : { x: 6, y: 4 },
      color: "dark",
      image: "pd.png",
      movements: [],
    },
    {
      name: "darkPawn6",
      position: darkOnTop ? { x: 1, y: 5 } : { x: 6, y: 5 },
      color: "dark",
      image: "pd.png",
      movements: [],
    },
    {
      name: "darkPawn7",
      position: darkOnTop ? { x: 1, y: 6 } : { x: 6, y: 6 },
      color: "dark",
      image: "pd.png",
      movements: [],
    },
    {
      name: "darkPawn8",
      position: darkOnTop ? { x: 1, y: 7 } : { x: 6, y: 7 },
      color: "dark",
      image: "pd.png",
      movements: [],
    },
  ];

  const lightPieces = [
    {
      name: "lightRook1",
      position: darkOnTop ? { x: 7, y: 0 } : { x: 0, y: 0 },
      color: "light",
      image: "rl.png",
      movements: [],
    },
    {
      name: "lightKnight1",
      position: darkOnTop ? { x: 7, y: 1 } : { x: 0, y: 1 },
      color: "light",
      image: "nl.png",
      movements: [],
    },
    {
      name: "lightBishop1",
      position: darkOnTop ? { x: 7, y: 2 } : { x: 0, y: 2 },
      color: "light",
      image: "bl.png",
      movements: [],
    },
    {
      name: "lightQueen",
      position: darkOnTop ? { x: 7, y: 3 } : { x: 0, y: 4 },
      color: "light",
      image: "ql.png",
      movements: [],
    },
    {
      name: "lightKing",
      position: darkOnTop ? { x: 7, y: 4 } : { x: 0, y: 3 },
      color: "light",
      image: "kl.png",
      movements: [],
    },
    {
      name: "lightBishop2",
      position: darkOnTop ? { x: 7, y: 5 } : { x: 0, y: 5 },
      color: "light",
      image: "bl.png",
      movements: [],
    },
    {
      name: "lightKnight2",
      position: darkOnTop ? { x: 7, y: 6 } : { x: 0, y: 6 },
      color: "light",
      image: "nl.png",
      movements: [],
    },
    {
      name: "lightRook2",
      position: darkOnTop ? { x: 7, y: 7 } : { x: 0, y: 7 },
      color: "light",
      image: "rl.png",
      movements: [],
    },

    // Peones light
    {
      name: "lightPawn1",
      position: darkOnTop ? { x: 6, y: 0 } : { x: 1, y: 0 },
      color: "light",
      image: "pl.png",
      movements: [],
    },
    {
      name: "lightPawn2",
      position: darkOnTop ? { x: 6, y: 1 } : { x: 1, y: 1 },
      color: "light",
      image: "pl.png",
      movements: [],
    },
    {
      name: "lightPawn3",
      position: darkOnTop ? { x: 6, y: 2 } : { x: 1, y: 2 },
      color: "light",
      image: "pl.png",
      movements: [],
    },
    {
      name: "lightPawn4",
      position: darkOnTop ? { x: 6, y: 3 } : { x: 1, y: 3 },
      color: "light",
      image: "pl.png",
      movements: [],
    },
    {
      name: "lightPawn5",
      position: darkOnTop ? { x: 6, y: 4 } : { x: 1, y: 4 },
      color: "light",
      image: "pl.png",
      movements: [],
    },
    {
      name: "lightPawn6",
      position: darkOnTop ? { x: 6, y: 5 } : { x: 1, y: 5 },
      color: "light",
      image: "pl.png",
      movements: [],
    },
    {
      name: "lightPawn7",
      position: darkOnTop ? { x: 6, y: 6 } : { x: 1, y: 6 },
      color: "light",
      image: "pl.png",
      movements: [],
    },
    {
      name: "lightPawn8",
      position: darkOnTop ? { x: 6, y: 7 } : { x: 1, y: 7 },
      color: "light",
      image: "pl.png",
      movements: [],
    },
  ];

  return [...darkPieces, ...lightPieces];
};

export { defineInitialPositions };
