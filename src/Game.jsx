import { useState, useEffect, useRef } from "react";
import Board from "./Board";
import tilesData from "./tilesData";

export default function Game() {
  const isRotating = useRef(false);
  const [activeBoard, setActiveBoard] = useState("ground");

  const [tiles, setTiles] = useState({
    upper: ["upper-landing"],
    ground: ["entrance-hall", "hallway", "ground-floor-staircase"],
    basement: ["basement-landing"],
  });
  const tileRefs = useRef({});

  let [players, setPlayers] = useState([
    {
      id: 1,
      name: "Player 1",
      tileId: "entrance-hall",
      level: "ground",
      row: 4,
      column: 3,
    },
    {
      id: 2,
      name: "Player 2",
      tileId: "entrance-hall",
      level: "ground",
      row: 4,
      column: 3,
    },
    {
      id: 3,
      name: "Player 3",
      tileId: "entrance-hall",
      level: "ground",
      row: 4,
      column: 3,
    },
    {
      id: 4,
      name: "Player 4",
      tileId: "entrance-hall",
      level: "ground",
      row: 4,
      column: 3,
    },
    {
      id: 5,
      name: "Player 5",
      tileId: "entrance-hall",
      level: "ground",
      row: 4,
      column: 3,
    },
    {
      id: 6,
      name: "Player 6",
      tileId: "entrance-hall",
      level: "ground",
      row: 4,
      column: 3,
    },
  ]);
  let playerRefs = useRef(players);
  let [activePlayerIndex, setActivePlayerIndex] = useState(0);

  useEffect(() => {
    function test() {
      if (event.key === "q")
        console.log(
          players[activePlayerIndex],
          playerRefs.current[activePlayerIndex]
        );
    }
    window.addEventListener("keydown", test);
    return () => window.removeEventListener("keydown", test);
  });

  useEffect(() => {
    const getDirection = (event) => {
      let newRow = players[activePlayerIndex].row;
      let newColumn = players[activePlayerIndex].column;
      let tile = tilesData.find(
        (tile) => tile.id === players[activePlayerIndex].tileId
      );
      switch (event.key) {
        case "ArrowUp":
          newRow--;
          handlePlayerMove(newRow, "up");
          break;
        case "ArrowDown":
          newRow++;
          handlePlayerMove(newRow, "down");
          break;
        case "ArrowLeft":
          newColumn--;
          handlePlayerMove(newColumn, "left");
          break;
        case "ArrowRight":
          newColumn++;
          handlePlayerMove(newColumn, "right");
          break;
        case "Enter":
          teleportToNewTile(tile);
        default:
          break;
      }
    };

    window.addEventListener("keydown", getDirection);
    return () => window.removeEventListener("keydown", getDirection);
  });

  async function handlePlayerMove(newPlace, direction, level) {
    if (isRotating.current) return;
    if (newPlace === 0 || newPlace === 6) return;
    if (checkForDoor(direction) === false && direction !== "teleport") return;
    if (activeBoard !== players[activePlayerIndex].level) return;
    if (direction === "up" || direction === "down") {
      playerRefs.current[activePlayerIndex].row = newPlace;
    } else if (direction === "right" || direction === "left") {
      playerRefs.current[activePlayerIndex].column = newPlace;
    } else if (direction === "teleport") {
      playerRefs.current[activePlayerIndex].row = newPlace[0];
      playerRefs.current[activePlayerIndex].column = newPlace[1];
      playerRefs.current[activePlayerIndex].level = level;
    }
    const tileId = await checkForTile(
      playerRefs.current[activePlayerIndex].row,
      playerRefs.current[activePlayerIndex].column,
      playerRefs.current[activePlayerIndex].level,
      direction
    );
    if (tileId === false) return;
    if (isRotating.current) {
      await handleRotateTile(tileId, direction);
    }
    setPlayers((prev) => {
      return prev.map((player, index) => {
        if (index === activePlayerIndex) {
          return {
            ...player,
            tileId: (playerRefs.current[activePlayerIndex].tileId = tileId),
            level: playerRefs.current[activePlayerIndex].level,
            row: playerRefs.current[activePlayerIndex].row,
            column: playerRefs.current[activePlayerIndex].column,
          };
        }
        return player;
      });
    });
  }

  function teleportToNewTile(currentTile) {
    if (!currentTile.leadsTo) return;
    const newTile = tilesData.find((tile) => tile.id === currentTile.leadsTo);
    if (newTile.row) {
      const row = newTile.row;
      const column = newTile.col;
      const floor = newTile.level;
      setActiveBoard(floor);
      handlePlayerMove([row, column], "teleport", floor);
    }
  }

  function checkForDoor(direction) {
    const doors = tilesData.find((tile) => {
      return tile.id === playerRefs.current[activePlayerIndex].tileId;
    }).doors;
    return doors.includes(direction);
  }

  function checkForTile(row, column, floor, direction) {
    return new Promise(async (resolve) => {
      const existingTile = tilesData.find(
        (tile) =>
          tile.level === floor && tile.row === row && tile.col === column
      );
      if (!existingTile) {
        const tileId = await getNewTile(row, column, floor);
        resolve(tileId);
      } else {
        if (
          checkDoorAlignment(existingTile.id, direction) === false &&
          direction !== "teleport"
        ) {
          playerRefs.current[activePlayerIndex].row =
            players[activePlayerIndex].row;
          playerRefs.current[activePlayerIndex].column =
            players[activePlayerIndex].column;
          playerRefs.current[activePlayerIndex].level =
            players[activePlayerIndex].level;
          resolve(false);
        }
        resolve(existingTile.id);
      }
    });
  }

  function getNewTile(row, column, floor) {
    return new Promise(async (resolve) => {
      const availableTiles = tilesData.filter((tile) => {
        return tile.floors[floor] === true && tile.row === undefined;
      });
      const index = Math.floor(Math.random() * availableTiles.length);
      availableTiles[index].row = row;
      availableTiles[index].col = column;
      availableTiles[index].level = floor;
      setTiles((prevTiles) => ({
        ...prevTiles,
        [floor]: [...prevTiles[floor], availableTiles[index].id],
      }));
      isRotating.current = true;
      resolve(availableTiles[index].id);
    });
  }

  function handleRotateTile(tileName, direction) {
    const tile = tileRefs.current[tileName];
    tile.classList.add("highlight");
    let currentRotation = 0;
    const tileChild = tile.children[0];
    let tileChildRotation = 0;
    return new Promise((resolve) => {
      function rotateTile() {
        if (event.key === "ArrowLeft") {
          currentRotation = (currentRotation - 90) % 360; // Rotate counterclockwise
          tileChildRotation = (tileChildRotation + 90) % 360;
          tile.style.transform = `rotate(${currentRotation}deg)`;
          tileChild.style.transform = `rotate(${tileChildRotation}deg)`;
          updateDoors("left", tile.id);
        } else if (event.key === "ArrowRight") {
          currentRotation = (currentRotation + 90) % 360; // Rotate counterclockwise
          tileChildRotation = (tileChildRotation - 90) % 360;
          tile.style.transform = `rotate(${currentRotation}deg)`;
          tileChild.style.transform = `rotate(${tileChildRotation}deg)`;
          updateDoors("right", tile.id);
        } else if (event.key === "Enter") {
          if (checkDoorAlignment(tileName, direction)) {
            document.removeEventListener("keydown", rotateTile);
            isRotating.current = false;
            tile.classList.remove("highlight");
            resolve();
          }
        }
      }
      document.addEventListener("keydown", rotateTile);
    });
  }

  function updateDoors(direction, newTile) {
    const doorsRotateLeft = {
      left: "up",
      up: "right",
      right: "down",
      down: "left",
    };
    const doorsRotateRight = {
      left: "down",
      down: "right",
      right: "up",
      up: "left",
    };
    let tileInfo = tilesData.find((tile) => tile.id === newTile);
    let updatedDoors = [];
    let rotationMap = direction === "left" ? doorsRotateRight : doorsRotateLeft;
    tileInfo.doors.forEach((door) => {
      updatedDoors.push(rotationMap[door]);
    });
    tileInfo.doors = updatedDoors;
  }

  function checkDoorAlignment(newTile, direction) {
    const alignmentKey = {
      up: "down",
      down: "up",
      left: "right",
      right: "left",
    };
    const nextTile = tilesData.find((tile) => tile.id === newTile);
    return nextTile.doors.includes(alignmentKey[direction]);
  }

  function endTurn() {
    const index = activePlayerIndex;
    if (activePlayerIndex === players.length - 1) {
      setActivePlayerIndex(0);
    } else {
      setActivePlayerIndex((prev) => prev + 1);
    }
  }

  const withBlur = (handler) => (e) => {
    e.currentTarget.blur();
    handler(e);
  };

  return (
    <div className="game-table">
      <Board
        className={`board upper ${activeBoard !== "upper" ? "hidden" : ""}`}
        tiles={tiles.upper}
        players={players}
        tileRefs={tileRefs}
      />
      <Board
        className={`board ground ${activeBoard !== "ground" ? "hidden" : ""}`}
        tiles={tiles.ground}
        players={players}
        tileRefs={tileRefs}
      />
      <Board
        className={`board basement ${
          activeBoard !== "basement" ? "hidden" : ""
        }`}
        tiles={tiles.basement}
        players={players}
        tileRefs={tileRefs}
      />

      <div className="side-panel">
        <div className="turn-indicator">
          {players[activePlayerIndex].name}'s turn
        </div>
        <button
          className="lvl-btn"
          id={`${activeBoard === "upper" ? "current" : ""}`}
          onClick={withBlur(() => setActiveBoard("upper"))}
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
        <button onClick={withBlur(() => endTurn())}>End Turn</button>
      </div>
    </div>
  );
}
