import { useState, useEffect, useRef } from "react";
import "./App.css";

const BOARD_SIZE = 20;

function App() {
  const [snake, setSnake] = useState([[8, 8]]);
  const [food, setFood] = useState([10, 10]);
  const [direction, setDirection] = useState([1, 0]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const moveRef = useRef(direction);

  useEffect(() => {
    moveRef.current = direction;
  }, [direction]);

  useEffect(() => {
    const handleKey = (e) => {
      switch (e.key) {
        case "ArrowUp":
          if (moveRef.current[1] !== 1) setDirection([0, -1]);
          break;
        case "ArrowDown":
          if (moveRef.current[1] !== -1) setDirection([0, 1]);
          break;
        case "ArrowLeft":
          if (moveRef.current[0] !== 1) setDirection([-1, 0]);
          break;
        case "ArrowRight":
          if (moveRef.current[0] !== -1) setDirection([1, 0]);
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(moveSnake, 120);
    return () => clearInterval(interval);
  });

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = newSnake[newSnake.length - 1];
    const newHead = [head[0] + direction[0], head[1] + direction[1]];

    // Wall collision
    if (
      newHead[0] < 0 ||
      newHead[1] < 0 ||
      newHead[0] >= BOARD_SIZE ||
      newHead[1] >= BOARD_SIZE
    ) {
      setGameOver(true);
      return;
    }

    // Self collision
    for (let segment of newSnake) {
      if (segment[0] === newHead[0] && segment[1] === newHead[1]) {
        setGameOver(true);
        return;
      }
    }

    newSnake.push(newHead);

    // Food collision
    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      setScore(score + 1);
      setFood([
        Math.floor(Math.random() * BOARD_SIZE),
        Math.floor(Math.random() * BOARD_SIZE),
      ]);
    } else {
      newSnake.shift();
    }

    setSnake(newSnake);
  };

  const resetGame = () => {
    setSnake([[8, 8]]);
    setFood([10, 10]);
    setDirection([1, 0]);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="container">
      <h1>🐍 Snake Game</h1>
      <p>Score: {score}</p>

      <div
        className="board"
        style={{
          gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
        }}
      >
        {Array.from({ length: BOARD_SIZE }).map((_, row) =>
          Array.from({ length: BOARD_SIZE }).map((_, col) => {
            const isSnake = snake.some(
              (segment) => segment[0] === col && segment[1] === row
            );
            const isHead =
              snake[snake.length - 1][0] === col &&
              snake[snake.length - 1][1] === row;
            const isFood = food[0] === col && food[1] === row;

            let bodyIndex = snake.findIndex(
              (segment) => segment[0] === col && segment[1] === row
            );
            const wiggleClass =
              isSnake && !isHead ? `wiggle-${bodyIndex % 2}` : "";

            return (
              <div
                key={`${row}-${col}`}
                className={`cell 
                  ${isSnake ? "snake" : ""} 
                  ${isHead ? "snake-head" : ""} 
                  ${isFood ? "food" : ""} 
                  ${wiggleClass}`}
              >
                {isFood ? <span className="apple">🍎</span> : ""}
                {isHead ? <div className="eyes" /> : ""}
              </div>
            );
          })
        )}
      </div>

      {gameOver && (
        <div className="overlay">
          <h2>Game Over</h2>
          <button onClick={resetGame}>Restart</button>
        </div>
      )}
    </div>
  );
}

export default App;
