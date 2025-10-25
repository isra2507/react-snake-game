import React from "react";

export default function Grid({ gridSize, snake, food }) {
  const cells = [];
  const total = gridSize * gridSize;
  const snakeSet = new Set(snake);

  for (let i = 0; i < total; i++) {
    const isSnake = snakeSet.has(i);
    const isHead = isSnake && i === snake[0];
    const isFood = i === food;
    const className = [
      "cell",
      isSnake ? (isHead ? "snake-head" : "snake") : "",
      isFood ? "food" : "",
    ].join(" ");
    cells.push(<div key={i} className={className} />);
  }

  const style = {
    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
    gridTemplateRows: `repeat(${gridSize}, 1fr)`,
  };

  return (
    <div className="grid" style={style} role="grid">
      {cells}
    </div>
  );
}
