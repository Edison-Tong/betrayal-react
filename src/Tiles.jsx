import Player from "./Player";

export default function Tiles({ data, players, tileRefs }) {
  return (
    <div
      className="tile"
      id={`${data.id}`}
      ref={(el) => {
        tileRefs.current[data.id] = el;
      }}
      style={{
        backgroundImage: `url(${data.image})`,
        backgroundSize: "cover",
        gridRow: data.row,
        gridColumn: data.col,
      }}
    >
      <div className="player-container">
        {players.map((player) => (
          <Player key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}
