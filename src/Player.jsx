export default function Player({ player }) {
  return (
    <div className="player" id={`p${player.id}`}>
      {player.id}
    </div>
  );
}
