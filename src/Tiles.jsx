import Player from "./Player";

export default function Tile({ data, players }) {
  return (
    <div
      className={`tile ${data.id}`}
      title={data.description}
      style={{
        backgroundImage: `url(${data.image})`,
        backgroundSize: "cover",
        gridRow: data.row,
        gridColumn: data.col,
      }}
    >
      {players.map((player) => (
        <Player key={player.id} player={player} />
      ))}
    </div>
  );
}
