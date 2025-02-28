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
        <div key={player.id} className="player">
          {player.id}
        </div>
      ))}
    </div>
  );
}
