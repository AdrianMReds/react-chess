const defineInitialPositions = (numbers) => {
  const darkOnTop = numbers[0] === "8";

  const darkPositions = {
    darkRook1: darkOnTop ? { x: 0, y: 0 } : { x: 7, y: 0 },
  };

  return [{ name: "darkRook1", position: darkPositions.darkRook1 }];
};

export { defineInitialPositions };
