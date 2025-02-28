import Tile from "./Tiles";
import tilesData from "./tilesData";

export default function Board({ className, tiles = [], size, players, test }) {
  const [rows, cols] = size;

  return (
    <div
      className={className}
      style={{
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
    >
      {tiles.map((tileId, index) => {
        const tileData = tilesData.find((tile) => tile.id === tileId);

        const playersOnTile = players.filter((player) => player.tileId === tileId);

        return tileData ? <Tile key={index} data={tileData} players={playersOnTile} /> : null;
      })}
    </div>
  );
}
