import Tile from "./Tiles";
import tilesData from "./tilesData";

export default function Board({ className, tiles = [] }) {
  return (
    <div className={className}>
      {tiles.map((tileId, index) => {
        const tileData = tilesData.find((tile) => tile.id === tileId); // Find the matching tile data
        return tileData ? <Tile key={index} data={tileData} /> : null;
      })}
    </div>
  );
}
