import Board from "./Board";

export default function Game() {
  return (
    <div className="game-table">
      {/* <Board className="board basement" size={[5, 5]} tiles={["basement-landing"]} /> */}
      <Board
        className="board ground active"
        size={[5, 5]}
        tiles={["entrance-hall", "hallway", "ground-floor-staircase"]}
      />
      {/* <Board className="board upper" size={[5, 5]} tiles={["upper-landing"]} /> */}
    </div>
  );
}
