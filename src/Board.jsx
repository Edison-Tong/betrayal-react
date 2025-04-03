import Tile from "./Tiles";
import tilesData from "./tilesData";

export default function Board({ className, tiles = [], players, tileRefs }) {
  return (
    <div
      className={className}
      style={{
        gridTemplateRows: "repeat(5, 1fr)",
        gridTemplateColumns: "repeat(5, 1fr)",
      }}
    >
      {tiles.map((tileId, index) => {
        const tileData = tilesData.find((tile) => tile.id === tileId);
        const playerData = players.filter((player) => player.tileId === tileId);

        return <Tile key={index} data={tileData} players={playerData} tileRefs={tileRefs} />;
      })}
    </div>
  );
}
