export default function Tile({ data }) {
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
    ></div>
  );
}
