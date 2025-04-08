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
    { id: 1, tileId: "entrance-hall", level: "ground", row: 4, column: 3 },
    { id: 2, tileId: "entrance-hall", level: "ground", row: 4, column: 3 },
    { id: 3, tileId: "entrance-hall", level: "ground", row: 4, column: 3 },
    { id: 4, tileId: "entrance-hall", level: "ground", row: 4, column: 3 },
    { id: 5, tileId: "entrance-hall", level: "ground", row: 4, column: 3 },
    { id: 6, tileId: "entrance-hall", level: "ground", row: 4, column: 3 },
  ]);
  let playerRefs = useRef(players);
  let [activePlayerIndex, setActivePlayerIndex] = useState(0);

  useEffect(() => {
    function test() {
      if (event.key === "q") console.log(players[activePlayerIndex]);
    }
    window.addEventListener("keydown", test);
    return () => window.removeEventListener("keydown", test);
  });

  useEffect(() => {
    const getDirection = (event) => {
      let newRow = players[activePlayerIndex].row;
      let newColumn = players[activePlayerIndex].column;
      let tile = tilesData.find((tile) => tile.id === players[activePlayerIndex].tileId);
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
        (tile) => tile.floors[floor] === true && tile.row === row && tile.col === column
      );
      if (!existingTile) {
        const tileId = await getNewTile(row, column, floor);
        resolve(tileId);
      } else {
        if (checkDoorAlignment(existingTile.id, direction) === false && direction !== "teleport") resolve(false);
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
    const doorsRotateLeft = { left: "up", up: "right", right: "down", down: "left" };
    const doorsRotateRight = { left: "down", down: "right", right: "up", up: "left" };
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

  // useEffect(() => {
  //   console.log(players);
  // }, [players]);

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
        className={`board basement ${activeBoard !== "basement" ? "hidden" : ""}`}
        tiles={tiles.basement}
        players={players}
        tileRefs={tileRefs}
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

// useEffect(() => {
//   const getDirection = (event) => {
//     switch (event.key) {
//       case "ArrowUp":
//         handlePlayerMove("up");
//         break;
//       case "ArrowDown":
//         handlePlayerMove("down");
//         break;
//       case "ArrowLeft":
//         handlePlayerMove("left");
//         break;
//       case "ArrowRight":
//         handlePlayerMove("right");
//         break;
//       default:
//         break;
//     }
//   };

//   window.addEventListener("keydown", getDirection);
//   return () => window.removeEventListener("keydown", getDirection);
// }, []);

// async function handlePlayerMove(direction) {
//   if (isRotating.current) return;

//   setPlayers((prevPlayers) =>
//     prevPlayers.map((player) =>
//       player.active
//         ? {
//             ...player,
//             row:
//               direction === "up" && player.row > 1
//                 ? player.row - 1
//                 : direction === "down" && player.row < 5
//                 ? player.row + 1
//                 : player.row,
//             column:
//               direction === "left" && player.column > 1
//                 ? player.column - 1
//                 : direction === "right" && player.column < 5
//                 ? player.column + 1
//                 : player.column,
//           }
//         : player
//     )
//   );
// }

// useEffect(() => {
//   setPlayers((prevPlayers) => {
//     return prevPlayers.map((player) => {
//       if (!player.active) return player; // Only update the active player

//       const existingTile = tilesData.find(
//         (tile) => tile.row === player.row && tile.col === player.column && tile.floors[player.level]
//       );

//       if (!existingTile) {
//         getNewTile(player);
//         return player;
//       } else {
//         return { ...player, tileId: existingTile.id }; // Update only if tileId changes
//       }
//     });
//   });
// }, [players.map((p) => `${p.row},${p.column}`).join(",")]); // Depend on player positions only

// async function getNewTile(player) {
//   const availableTiles = tilesData.filter((tile) => {
//     return tile.row === undefined && tile.floors[player.level] === true;
//   });
//   if (availableTiles.length === 0) return false;
//   const index = Math.floor(Math.random() * availableTiles.length);
//   availableTiles[index].row = player.row;
//   availableTiles[index].col = player.column;
//   availableTiles[index].level = player.level;
//   player.tileId = availableTiles[index].id;
//   setTiles((prevTiles) => ({
//     ...prevTiles,
//     [player.level]: [...prevTiles[player.level], availableTiles[index].id],
//   }));
//   setTimeout(() => {
//     handleRotateTile(availableTiles[index].id);
//   }, 1);
// }

// function handleRotateTile(tileName) {
//   let tile = tileRefs.current[tileName];
//   tile.classList.add("highlight");
//   console.log(tile);
//   return new Promise((resolve) => {
//     resolve();
//     isRotating.current = true;
//     let currentRotation = 0;

//     // Function to rotate the tile
//     function rotateTile(event) {
//       if (event.key === "ArrowLeft") {
//         currentRotation = (currentRotation - 90) % 360; // Rotate counterclockwise
//         tile.style.transform = `rotate(${currentRotation}deg)`;
//         updateDoors("left");
//       } else if (event.key === "ArrowRight") {
//         currentRotation = (currentRotation + 90) % 360; // Rotate clockwise
//         tile.style.transform = `rotate(${currentRotation}deg)`;
//         updateDoors("right");
//       } else if (event.key === "Enter") {
//         // Finalize rotation
//         // if (!checkDoorAlignment()) {
//         //   return;
//         // }
//         document.removeEventListener("keydown", rotateTile); // Remove the event listener
//         isRotating.current = false; // Reset the flag to resume actions
//         tile.classList.remove("highlight");
//         resolve(); // Resolve the promise to indicate the rotation is done
//         endTurnBtn.addEventListener("click", handleEndOfTurn);
//       }
//     }

//     // Add event listener to listen for key presses
//     document.addEventListener("keydown", rotateTile);
//   });
// }
