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

  let [players, setPlayers] = useState([
    { id: 1, tileId: "entrance-hall", level: "ground", row: 4, column: 3, active: true },
    { id: 2, tileId: "entrance-hall", level: "ground", row: 4, column: 3, active: false },
    { id: 3, tileId: "entrance-hall", level: "ground", row: 4, column: 3, active: false },
    { id: 4, tileId: "entrance-hall", level: "ground", row: 4, column: 3, active: false },
    { id: 5, tileId: "entrance-hall", level: "ground", row: 4, column: 3, active: false },
    { id: 6, tileId: "entrance-hall", level: "ground", row: 4, column: 3, active: false },
  ]);

  useEffect(() => {
    const getDirection = (event) => {
      switch (event.key) {
        case "ArrowUp":
          handlePlayerMove("up");
          break;
        case "ArrowDown":
          handlePlayerMove("down");
          break;
        case "ArrowLeft":
          handlePlayerMove("left");
          break;
        case "ArrowRight":
          handlePlayerMove("right");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", getDirection);
    return () => window.removeEventListener("keydown", getDirection);
  }, []);

  async function handlePlayerMove(direction) {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.active
          ? {
              ...player,
              row:
                direction === "up" && player.row > 1
                  ? player.row - 1
                  : direction === "down" && player.row < 5
                  ? player.row + 1
                  : player.row,
              column:
                direction === "left" && player.column > 1
                  ? player.column - 1
                  : direction === "right" && player.column < 5
                  ? player.column + 1
                  : player.column,
            }
          : player
      )
    );
  }

  // useEffect(() => {
  //   getPlayersTile();
  // }, [players]);

  // function getPlayersTile() {
  //   const activePlayer = players.find((player) => player.active);
  //   const row = activePlayer.row;
  //   const column = activePlayer.column;
  //   const level = activePlayer.level;
  //   const existingTile = tilesData.find((tile) => tile.row === row && tile.col === column && tile.floors[level]);
  //   console.log(existingTile);

  //   setPlayers((prevPlayers) => {
  //     return prevPlayers.map((player) => (player.active ? { ...player, tileId: existingTile.id } : player));
  //   });
  // }

  useEffect(() => {
    setPlayers((prevPlayers) => {
      return prevPlayers.map((player) => {
        if (!player.active) return player; // Only update the active player

        const existingTile = tilesData.find(
          (tile) => tile.row === player.row && tile.col === player.column && tile.floors[player.level]
        );

        if (!existingTile) {
          getNewTile(player);
          return player;
        } else {
          return { ...player, tileId: existingTile.id }; // Update only if tileId changes
        }
      });
    });
  }, [players.map((p) => `${p.row},${p.column}`).join(",")]); // Depend on player positions only

  function getNewTile(player) {
    console.log(player);
    const availableTiles = tilesData.filter((tile) => {
      return tile.row === undefined && tile.floors[player.level] === true;
    });
    if (availableTiles.length === 0) return false;
    const index = Math.floor(Math.random() * availableTiles.length);
    availableTiles[index].row = player.row;
    availableTiles[index].col = player.column;
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
