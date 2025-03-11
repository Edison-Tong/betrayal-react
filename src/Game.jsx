import { useState, useEffect } from "react";
import Board from "./Board";
import tilesData from "./tilesData";

export default function Game() {
  const [activeBoard, setActiveBoard] = useState("ground");
  const [tiles, setTiles] = useState({
    upper: ["upper-landing"],
    ground: ["entrance-hall", "hallway", "ground-floor-staircase"],
    basement: ["basement-landing"],
  });

  const [players, setPlayers] = useState([
    { id: 1, tileId: "entrance-hall", level: "ground", row: 4, col: 3 },
    { id: 2, tileId: "entrance-hall", level: "ground", row: 4, col: 3 },
    { id: 3, tileId: "entrance-hall", level: "ground", row: 4, col: 3 },
    { id: 4, tileId: "entrance-hall", level: "ground", row: 4, col: 3 },
    { id: 5, tileId: "entrance-hall", level: "ground", row: 4, col: 3 },
    { id: 6, tileId: "entrance-hall", level: "ground", row: 4, col: 3 },
  ]);

  const [activePlayer, setActivePlayer] = useState(players[0]);

  useEffect(() => {
    function handlePlayerMovement(event) {
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) => {
          if (player.id !== activePlayer.id) return player; // Keep other players unchanged

          // Clone the player object to avoid direct mutation
          const newPlayer = { ...player };

          switch (event.key) {
            case "ArrowUp":
              newPlayer.row -= 1;
              break;
            case "ArrowDown":
              newPlayer.row += 1;
              break;
            case "ArrowLeft":
              newPlayer.col -= 1;
              break;
            case "ArrowRight":
              newPlayer.col += 1;
              break;
            default:
              return player; // Ignore non-movement keys
          }

          // Check if the move is valid
          const existingTile = tilesData.find(
            (tile) => tile.row === newPlayer.row && tile.col === newPlayer.col && tile.level === newPlayer.level
          );

          if (existingTile) {
            newPlayer.tileId = existingTile.id;
          } else {
            if (getNewTile(newPlayer) === false) {
              return player;
            }
          }
          return newPlayer; // Return updated player
        })
      );
    }

    window.addEventListener("keydown", handlePlayerMovement);

    return () => {
      window.removeEventListener("keydown", handlePlayerMovement);
    };
  }, [activePlayer]);

  function getNewTile(player) {
    const availableTiles = tilesData.filter((tile) => {
      return tile.row === undefined && tile.floors[activePlayer.level] === true;
    });
    if (availableTiles.length === 0) return false;
    const index = Math.floor(Math.random() * availableTiles.length);
    availableTiles[index].row = player.row;
    availableTiles[index].col = player.col;
    availableTiles[index].level = player.level;
    player.tileId = availableTiles[index].id;
    setTiles((prevTiles) => ({
      ...prevTiles,
      [player.level]: [...prevTiles[player.level], availableTiles[index].id],
    }));
  }

  return (
    <div className="game-table">
      <Board
        className={`board upper ${activeBoard !== "upper" ? "hidden" : ""}`}
        tiles={tiles.upper}
        players={players}
      />
      <Board
        className={`board ground ${activeBoard !== "ground" ? "hidden" : ""}`}
        tiles={tiles.ground}
        players={players}
      />
      <Board
        className={`board basement ${activeBoard !== "basement" ? "hidden" : ""}`}
        tiles={tiles.basement}
        players={players}
      />

      <div className="board-buttons">
        <button
          className="lvl-btn"
          id={`${activeBoard === "upper" ? "current" : ""}`}
          onClick={() => setActiveBoard("upper")}
        >
          Upper
        </button>
        <button
          className="lvl-btn"
          id={`${activeBoard === "ground" ? "current" : ""}`}
          onClick={() => setActiveBoard("ground")}
        >
          Ground
        </button>
        <button
          className="lvl-btn"
          id={`${activeBoard === "basement" ? "current" : ""}`}
          onClick={() => setActiveBoard("basement")}
        >
          Basement
        </button>
      </div>
    </div>
  );
}
