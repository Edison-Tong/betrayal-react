import { useState } from "react";
import Board from "./Board";

export default function Game() {
  const [activeBoard, setActiveBoard] = useState("ground");

  return (
    <div className="game-table">
      <Board
        className={`board basement ${activeBoard !== "basement" ? "hidden" : ""}`}
        size={[5, 5]}
        tiles={["basement-landing"]}
      />
      <Board
        className={`board ground ${activeBoard !== "ground" ? "hidden" : ""}`}
        size={[5, 5]}
        tiles={["entrance-hall", "hallway", "ground-floor-staircase"]}
      />
      <Board
        className={`board upper ${activeBoard !== "upper" ? "hidden" : ""}`}
        size={[5, 5]}
        tiles={["upper-landing"]}
      />

      <div className="board-buttons">
        <button className="lvl-btn" onClick={() => setActiveBoard("upper")}>
          Upper
        </button>
        <button className="lvl-btn" onClick={() => setActiveBoard("ground")}>
          Ground
        </button>
        <button className="lvl-btn" onClick={() => setActiveBoard("basement")}>
          Basement
        </button>
      </div>
    </div>
  );
}
