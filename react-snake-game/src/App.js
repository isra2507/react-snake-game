import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from "react-native";

const CELL_SIZE = 20;
const GRID_SIZE = 15;
const SCREEN_WIDTH = Dimensions.get("window").width;
const BOARD_SIZE = Math.min(SCREEN_WIDTH - 40, GRID_SIZE * CELL_SIZE);

export default function App() {
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [apple, setApple] = useState({ x: 10, y: 10 });
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(moveSnake, 200);
    return () => clearInterval(intervalRef.current);
  }, [snake, direction]);

  function moveSnake() {
    if (gameOver) return;
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case "UP": head.y -= 1; break;
      case "DOWN": head.y += 1; break;
      case "LEFT": head.x -= 1; break;
      case "RIGHT": head.x += 1; break;
    }

    // Check walls or self collision
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE ||
      newSnake.some(seg => seg.x === head.x && seg.y === head.y)
    ) {
      setGameOver(true);
      clearInterval(intervalRef.current);
      return;
    }

    newSnake.unshift(head);

    // Eat apple
    if (head.x === apple.x && head.y === apple.y) {
      setApple({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      });
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }

  const changeDirection = (newDir) => {
    if (
      (direction === "UP" && newDir === "DOWN") ||
      (direction === "DOWN" && newDir === "UP") ||
      (direction === "LEFT" && newDir === "RIGHT") ||
      (direction === "RIGHT" && newDir === "LEFT")
    ) return;
    setDirection(newDir);
  };

  const resetGame = () => {
    setSnake([{ x: 5, y: 5 }]);
    setApple({ x: 10, y: 10 });
    setDirection("RIGHT");
    setGameOver(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐍 Snake Game</Text>

      <View style={[styles.board, { width: BOARD_SIZE, height: BOARD_SIZE }]}>
        {/* Snake */}
        {snake.map((seg, i) => (
          <View
            key={i}
            style={[
              styles.snakeSegment,
              {
                left: seg.x * CELL_SIZE,
                top: seg.y * CELL_SIZE,
                backgroundColor: i === 0 ? "#1abc9c" : "#2ecc71",
              },
            ]}
          />
        ))}
        {/* Apple */}
        <View
          style={[
            styles.apple,
            { left: apple.x * CELL_SIZE, top: apple.y * CELL_SIZE },
          ]}
        />
      </View>

      {gameOver ? (
        <TouchableOpacity onPress={resetGame} style={styles.button}>
          <Text style={styles.buttonText}>Restart</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.controls}>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => changeDirection("UP")} style={styles.control}><Text>⬆️</Text></TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => changeDirection("LEFT")} style={styles.control}><Text>⬅️</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => changeDirection("DOWN")} style={styles.control}><Text>⬇️</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => changeDirection("RIGHT")} style={styles.control}><Text>➡️</Text></TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  board: {
    position: "relative",
    backgroundColor: "#333",
    borderWidth: 2,
    borderColor: "#444",
  },
  snakeSegment: {
    position: "absolute",
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 4,
  },
  apple: {
    position: "absolute",
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: "red",
    borderRadius: CELL_SIZE / 2,
  },
  controls: {
    marginTop: 30,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
  control: {
    backgroundColor: "#fff",
    padding: 10,
    margin: 5,
    borderRadius: 8,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#1abc9c",
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
