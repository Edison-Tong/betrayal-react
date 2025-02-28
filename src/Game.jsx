import { useState } from "react";
import Board from "./Board";

export default function Game() {
  const [activeBoard, setActiveBoard] = useState("ground");

  const [players, setPlayers] = useState([
    { id: 1, tileId: "entrance-hall" },
    { id: 2, tileId: "entrance-hall" },
    { id: 3, tileId: "entrance-hall" },
    { id: 4, tileId: "entrance-hall" },
    { id: 5, tileId: "entrance-hall" },
    { id: 6, tileId: "entrance-hall" },
  ]);

  return (
    <div className="game-table">
      <Board
        className={`board basement ${activeBoard !== "basement" ? "hidden" : ""}`}
        size={[5, 5]}
        tiles={["basement-landing"]}
        players={players}
      />
      <Board
        className={`board ground ${activeBoard !== "ground" ? "hidden" : ""}`}
        size={[5, 5]}
        tiles={["entrance-hall", "hallway", "ground-floor-staircase"]}
        players={players}
      />
      <Board
        className={`board upper ${activeBoard !== "upper" ? "hidden" : ""}`}
        size={[5, 5]}
        tiles={["upper-landing"]}
        players={players}
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
