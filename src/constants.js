const defineInitialPositions = (numbers) => {
  const darkOnTop = numbers[0] === "8";
  const darkPieces = [
    {
      name: "darkRook1",
      type: "rook",
      position: darkOnTop ? { x: 0, y: 0 } : { x: 0, y: 7 },
      color: "dark",
      image: "rd.png",
      movements: [],
    },
    {
      name: "darkKnight1",
      type: "knight",
      position: darkOnTop ? { x: 1, y: 0 } : { x: 1, y: 7 },
      color: "dark",
      image: "nd.png",
      movements: [],
    },
    {
      name: "darkBishop1",
      type: "bishop",
      position: darkOnTop ? { x: 2, y: 0 } : { x: 2, y: 7 },
      color: "dark",
      image: "bd.png",
      movements: [],
    },
    {
      name: "darkQueen",
      type: "queen",
      position: darkOnTop ? { x: 3, y: 0 } : { x: 4, y: 7 },
      color: "dark",
      image: "qd.png",
      movements: [],
    },
    {
      name: "darkKing",
      type: "king",
      position: darkOnTop ? { x: 4, y: 0 } : { x: 3, y: 7 },
      color: "dark",
      image: "kd.png",
      movements: [],
    },
    {
      name: "darkBishop2",
      type: "bishop",
      position: darkOnTop ? { x: 5, y: 0 } : { x: 5, y: 7 },
      color: "dark",
      image: "bd.png",
      movements: [],
    },
    {
      name: "darkKnight2",
      type: "knight",
      position: darkOnTop ? { x: 6, y: 0 } : { x: 6, y: 7 },
      color: "dark",
      image: "nd.png",
      movements: [],
    },
    {
      name: "darkRook2",
      type: "rook",
      position: darkOnTop ? { x: 7, y: 0 } : { x: 7, y: 7 },
      color: "dark",
      image: "rd.png",
      movements: [],
    },
    {
      name: "darkPawn1",
      type: "pawn",
      position: darkOnTop ? { x: 0, y: 1 } : { x: 0, y: 6 },
      color: "dark",
      image: "pd.png",
      movements: [],
      hasMoved: false,
    },
    {
      name: "darkPawn2",
      type: "pawn",
      position: darkOnTop ? { x: 1, y: 1 } : { x: 1, y: 6 },
      color: "dark",
      image: "pd.png",
      movements: [],
      hasMoved: false,
    },
    {
      name: "darkPawn3",
      type: "pawn",
      position: darkOnTop ? { x: 2, y: 1 } : { x: 2, y: 6 },
      color: "dark",
      image: "pd.png",
      movements: [],
      hasMoved: false,
    },
    {
      name: "darkPawn4",
      type: "pawn",
      position: darkOnTop ? { x: 3, y: 1 } : { x: 3, y: 6 },
      color: "dark",
      image: "pd.png",
      movements: [],
      hasMoved: false,
    },
    {
      name: "darkPawn5",
      type: "pawn",
      position: darkOnTop ? { x: 4, y: 1 } : { x: 4, y: 6 },
      color: "dark",
      image: "pd.png",
      movements: [],
      hasMoved: false,
    },
    {
      name: "darkPawn6",
      type: "pawn",
      position: darkOnTop ? { x: 5, y: 1 } : { x: 5, y: 6 },
      color: "dark",
      image: "pd.png",
      movements: [],
      hasMoved: false,
    },
    {
      name: "darkPawn7",
      type: "pawn",
      position: darkOnTop ? { x: 6, y: 1 } : { x: 6, y: 6 },
      color: "dark",
      image: "pd.png",
      movements: [],
      hasMoved: false,
    },
    {
      name: "darkPawn8",
      type: "pawn",
      position: darkOnTop ? { x: 7, y: 1 } : { x: 7, y: 6 },
      color: "dark",
      image: "pd.png",
      movements: [],
      hasMoved: false,
    },
  ];

  const lightPieces = [
    {
      name: "lightRook1",
      type: "rook",
      position: darkOnTop ? { x: 0, y: 7 } : { x: 0, y: 0 },
      color: "light",
      image: "rl.png",
      movements: [],
    },
    {
      name: "lightKnight1",
      type: "knight",
      position: darkOnTop ? { x: 1, y: 7 } : { x: 1, y: 0 },
      color: "light",
      image: "nl.png",
      movements: [],
    },
    {
      name: "lightBishop1",
      type: "bishop",
      position: darkOnTop ? { x: 2, y: 7 } : { x: 2, y: 0 },
      color: "light",
      image: "bl.png",
      movements: [],
    },
    {
      name: "lightQueen",
      type: "queen",
      position: darkOnTop ? { x: 3, y: 7 } : { x: 4, y: 0 },
      color: "light",
      image: "ql.png",
      movements: [],
    },
    {
      name: "lightKing",
      type: "king",
      position: darkOnTop ? { x: 4, y: 7 } : { x: 3, y: 0 },
      color: "light",
      image: "kl.png",
      movements: [],
    },
    {
      name: "lightBishop2",
      type: "bishop",
      position: darkOnTop ? { x: 5, y: 7 } : { x: 5, y: 0 },
      color: "light",
      image: "bl.png",
      movements: [],
    },
    {
      name: "lightKnight2",
      type: "knight",
      position: darkOnTop ? { x: 6, y: 7 } : { x: 6, y: 0 },
      color: "light",
      image: "nl.png",
      movements: [],
    },
    {
      name: "lightRook2",
      type: "rook",
      position: darkOnTop ? { x: 7, y: 7 } : { x: 7, y: 0 },
      color: "light",
      image: "rl.png",
      movements: [],
    },
    {
      name: "lightPawn1",
      type: "pawn",
      position: darkOnTop ? { x: 0, y: 6 } : { x: 0, y: 1 },
      color: "light",
      image: "pl.png",
      movements: [],
      hasMoved: false,
    },
    {
      name: "lightPawn2",
      type: "pawn",
      position: darkOnTop ? { x: 1, y: 6 } : { x: 1, y: 1 },
      color: "light",
      image: "pl.png",
      movements: [],
      hasMoved: false,
    },
    {
      name: "lightPawn3",
      type: "pawn",
      position: darkOnTop ? { x: 2, y: 6 } : { x: 2, y: 1 },
      color: "light",
      image: "pl.png",
      movements: [],
      hasMoved: false,
    },
    {
      name: "lightPawn4",
      type: "pawn",
      position: darkOnTop ? { x: 3, y: 6 } : { x: 3, y: 1 },
      color: "light",
      image: "pl.png",
      movements: [],
      hasMoved: false,
    },
    {
      name: "lightPawn5",
      type: "pawn",
      position: darkOnTop ? { x: 4, y: 6 } : { x: 4, y: 1 },
      color: "light",
      image: "pl.png",
      movements: [],
      hasMoved: false,
    },
    {
      name: "lightPawn6",
      type: "pawn",
      position: darkOnTop ? { x: 5, y: 6 } : { x: 5, y: 1 },
      color: "light",
      image: "pl.png",
      movements: [],
      hasMoved: false,
    },
    {
      name: "lightPawn7",
      type: "pawn",
      position: darkOnTop ? { x: 6, y: 6 } : { x: 6, y: 1 },
      color: "light",
      image: "pl.png",
      movements: [],
      hasMoved: false,
    },
    {
      name: "lightPawn8",
      type: "pawn",
      position: darkOnTop ? { x: 7, y: 6 } : { x: 7, y: 1 },
      color: "light",
      image: "pl.png",
      movements: [],
      hasMoved: false,
    },
  ];

  return [...darkPieces, ...lightPieces];
};

// const tempPieces = [
//     {
//         "name": "darkRook1",
//         "type": "rook",
//         "position": {
//             "x": 0,
//             "y": 0
//         },
//         "color": "dark",
//         "image": "rd.png",
//         "movements": []
//     },
//     {
//         "name": "darkKnight1",
//         "type": "knight",
//         "position": {
//             "x": 2,
//             "y": 2
//         },
//         "color": "dark",
//         "image": "nd.png",
//         "movements": [],
//         "hasMoved": true
//     },
//     {
//         "name": "darkBishop1",
//         "type": "bishop",
//         "position": {
//             "x": 5,
//             "y": 3
//         },
//         "color": "dark",
//         "image": "bd.png",
//         "movements": [],
//         "hasMoved": true
//     },
//     {
//         "name": "darkQueen",
//         "type": "queen",
//         "position": {
//             "x": 3,
//             "y": 2
//         },
//         "color": "dark",
//         "image": "qd.png",
//         "movements": [],
//         "hasMoved": true
//     },
//     {
//         "name": "darkKing",
//         "type": "king",
//         "position": {
//             "x": 4,
//             "y": 0
//         },
//         "color": "dark",
//         "image": "kd.png",
//         "movements": []
//     },
//     {
//         "name": "darkBishop2",
//         "type": "bishop",
//         "position": {
//             "x": 2,
//             "y": 3
//         },
//         "color": "dark",
//         "image": "bd.png",
//         "movements": [],
//         "hasMoved": true
//     },
//     {
//         "name": "darkKnight2",
//         "type": "knight",
//         "position": {
//             "x": 5,
//             "y": 2
//         },
//         "color": "dark",
//         "image": "nd.png",
//         "movements": [],
//         "hasMoved": true
//     },
//     {
//         "name": "darkRook2",
//         "type": "rook",
//         "position": {
//             "x": 7,
//             "y": 0
//         },
//         "color": "dark",
//         "image": "rd.png",
//         "movements": []
//     },
//     {
//         "name": "darkPawn1",
//         "type": "pawn",
//         "position": {
//             "x": 0,
//             "y": 1
//         },
//         "color": "dark",
//         "image": "pd.png",
//         "movements": [],
//         "hasMoved": false
//     },
//     {
//         "name": "darkPawn2",
//         "type": "pawn",
//         "position": {
//             "x": 1,
//             "y": 1
//         },
//         "color": "dark",
//         "image": "pd.png",
//         "movements": [],
//         "hasMoved": false
//     },
//     {
//         "name": "darkPawn3",
//         "type": "pawn",
//         "position": {
//             "x": 2,
//             "y": 1
//         },
//         "color": "dark",
//         "image": "pd.png",
//         "movements": [],
//         "hasMoved": false
//     },
//     {
//         "name": "darkPawn4",
//         "type": "pawn",
//         "position": {
//             "x": 3,
//             "y": 3
//         },
//         "color": "dark",
//         "image": "pd.png",
//         "movements": [],
//         "hasMoved": true
//     },
//     {
//         "name": "darkPawn5",
//         "type": "pawn",
//         "position": {
//             "x": 4,
//             "y": 3
//         },
//         "color": "dark",
//         "image": "pd.png",
//         "movements": [],
//         "hasMoved": true
//     },
//     {
//         "name": "darkPawn6",
//         "type": "pawn",
//         "position": {
//             "x": 5,
//             "y": 1
//         },
//         "color": "dark",
//         "image": "pd.png",
//         "movements": [],
//         "hasMoved": false
//     },
//     {
//         "name": "darkPawn7",
//         "type": "pawn",
//         "position": {
//             "x": 6,
//             "y": 1
//         },
//         "color": "dark",
//         "image": "pd.png",
//         "movements": [],
//         "hasMoved": false
//     },
//     {
//         "name": "darkPawn8",
//         "type": "pawn",
//         "position": {
//             "x": 7,
//             "y": 1
//         },
//         "color": "dark",
//         "image": "pd.png",
//         "movements": [],
//         "hasMoved": false
//     },
//     {
//         "name": "lightRook1",
//         "type": "rook",
//         "position": {
//             "x": 0,
//             "y": 7
//         },
//         "color": "light",
//         "image": "rl.png",
//         "movements": []
//     },
//     {
//         "name": "lightKnight1",
//         "type": "knight",
//         "position": {
//             "x": 2,
//             "y": 5
//         },
//         "color": "light",
//         "image": "nl.png",
//         "movements": [],
//         "hasMoved": true
//     },
//     {
//         "name": "lightBishop1",
//         "type": "bishop",
//         "position": {
//             "x": 5,
//             "y": 4
//         },
//         "color": "light",
//         "image": "bl.png",
//         "movements": [],
//         "hasMoved": true
//     },
//     {
//         "name": "lightQueen",
//         "type": "queen",
//         "position": {
//             "x": 3,
//             "y": 5
//         },
//         "color": "light",
//         "image": "ql.png",
//         "movements": [],
//         "hasMoved": true
//     },
//     {
//         "name": "lightKing",
//         "type": "king",
//         "position": {
//             "x": 4,
//             "y": 7
//         },
//         "color": "light",
//         "image": "kl.png",
//         "movements": []
//     },
//     {
//         "name": "lightBishop2",
//         "type": "bishop",
//         "position": {
//             "x": 2,
//             "y": 4
//         },
//         "color": "light",
//         "image": "bl.png",
//         "movements": [],
//         "hasMoved": true
//     },
//     {
//         "name": "lightKnight2",
//         "type": "knight",
//         "position": {
//             "x": 5,
//             "y": 5
//         },
//         "color": "light",
//         "image": "nl.png",
//         "movements": [],
//         "hasMoved": true
//     },
//     {
//         "name": "lightRook2",
//         "type": "rook",
//         "position": {
//             "x": 7,
//             "y": 7
//         },
//         "color": "light",
//         "image": "rl.png",
//         "movements": []
//     },
//     {
//         "name": "lightPawn1",
//         "type": "pawn",
//         "position": {
//             "x": 0,
//             "y": 6
//         },
//         "color": "light",
//         "image": "pl.png",
//         "movements": [],
//         "hasMoved": false
//     },
//     {
//         "name": "lightPawn2",
//         "type": "pawn",
//         "position": {
//             "x": 1,
//             "y": 6
//         },
//         "color": "light",
//         "image": "pl.png",
//         "movements": [],
//         "hasMoved": false
//     },
//     {
//         "name": "lightPawn3",
//         "type": "pawn",
//         "position": {
//             "x": 2,
//             "y": 6
//         },
//         "color": "light",
//         "image": "pl.png",
//         "movements": [],
//         "hasMoved": false
//     },
//     {
//         "name": "lightPawn4",
//         "type": "pawn",
//         "position": {
//             "x": 3,
//             "y": 4
//         },
//         "color": "light",
//         "image": "pl.png",
//         "movements": [],
//         "hasMoved": true
//     },
//     {
//         "name": "lightPawn5",
//         "type": "pawn",
//         "position": {
//             "x": 4,
//             "y": 4
//         },
//         "color": "light",
//         "image": "pl.png",
//         "movements": [],
//         "hasMoved": true
//     },
//     {
//         "name": "lightPawn6",
//         "type": "pawn",
//         "position": {
//             "x": 5,
//             "y": 6
//         },
//         "color": "light",
//         "image": "pl.png",
//         "movements": [],
//         "hasMoved": false
//     },
//     {
//         "name": "lightPawn7",
//         "type": "pawn",
//         "position": {
//             "x": 6,
//             "y": 6
//         },
//         "color": "light",
//         "image": "pl.png",
//         "movements": [],
//         "hasMoved": false
//     },
//     {
//         "name": "lightPawn8",
//         "type": "pawn",
//         "position": {
//             "x": 7,
//             "y": 6
//         },
//         "color": "light",
//         "image": "pl.png",
//         "movements": [],
//         "hasMoved": false
//     }
// ];

// const tempHistory = [
//     {
//         "light": "e4",
//         "dark": "e5"
//     },
//     {
//         "light": "d4",
//         "dark": "d5"
//     },
//     {
//         "light": "Bc4",
//         "dark": "Bf5"
//     },
//     {
//         "light": "Bf4",
//         "dark": "Bc5"
//     },
//     {
//         "light": "Nc3",
//         "dark": "Nc6"
//     },
//     {
//         "light": "Nf3",
//         "dark": "Nf6"
//     },
//     {
//         "light": "Qd3",
//         "dark": "Qd6"
//     }
// ];

export { defineInitialPositions, tempPieces, tempHistory };
