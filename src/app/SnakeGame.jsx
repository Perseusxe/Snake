"use client";
import "./globals.css";

import React, { useEffect, useRef, useState } from "react";

export default function SnakeGame() {
  const canvasRef = useRef(null);
  const box = 20;
  const [snake, setSnake] = useState([{ x: 9 * box, y: 9 * box }]);
  const [direction, setDirection] = useState("RIGHT");
  const [food, setFood] = useState({
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
  });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const interval = setInterval(draw, 150);
    document.addEventListener("keydown", changeDirection);

    return () => {
      clearInterval(interval);
      document.removeEventListener("keydown", changeDirection);
    };
  }, [snake, direction]);

  function changeDirection(event) {
    // Use WASD for movement
    if (event.key === "a" && direction !== "RIGHT") setDirection("LEFT");
    if (event.key === "w" && direction !== "DOWN") setDirection("UP");
    if (event.key === "d" && direction !== "LEFT") setDirection("RIGHT");
    if (event.key === "s" && direction !== "UP") setDirection("DOWN");
  }

  function collision(head, array) {
    return array.some((segment) => head.x === segment.x && head.y === segment.y);
  }

  function draw() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!snake || snake.length === 0) return;  // Early return if snake is empty

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? "green" : "white";
      ctx.fillRect(segment.x, segment.y, box, box);
      ctx.strokeStyle = "black";
      ctx.strokeRect(segment.x, segment.y, box, box);
    });

    // Calculate new head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    // Check if the snake eats food
    if (snakeX === food.x && snakeY === food.y) {
      setScore((prev) => prev + 1);
      setFood({
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box,
      });
    } else {
      snake.pop(); // Remove the tail
    }

    const newHead = { x: snakeX, y: snakeY };

    // Check for collision
    if (
      snakeX < 0 ||
      snakeY < 0 ||
      snakeX >= canvas.width ||
      snakeY >= canvas.height ||
      collision(newHead, snake)
    ) {
      setGameOver(true);  // Set game over state to true
      return;
    }

    setSnake((prevSnake) => [newHead, ...prevSnake]);
  }

  // Modal component to display game over message
  const Modal = ({ score, onRestart }) => {
    return (
      <div class="outer">
        <div class="modal">
          <h1>Game Over!</h1>
          <p className="">Your score: {score}</p>
          <button onClick={onRestart} className="">Restart</button>
        </div>
      </div>
    );
  };


  function restartGame() {
    setGameOver(false);
    setSnake([{ x: 9 * box, y: 9 * box }]);
    setDirection("RIGHT");
    setFood({
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box,
    });
    setScore(0);
  }

  return (
    <div>
      <canvas ref={canvasRef} width={800} height={800} />
      {gameOver && <Modal score={score} onRestart={restartGame} />}
    </div>
  );
}
