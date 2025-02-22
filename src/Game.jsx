import Board from "./Board";

export default function Game() {
  return (
    <div className="game-table">
      <Board className="board basement" tiles={["basement-landing"]} />
      <Board className="board ground active" tiles={["entrance-hall", "hallway", "ground-floor-staircase"]} />
      <Board className="board upper" tiles={["upper-landing"]} />
    </div>
  );
}
