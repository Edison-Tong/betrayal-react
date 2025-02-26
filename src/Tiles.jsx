export default function Tile({ data }) {
  return (
    <div
      className={`tile ${data.id}`}
      title={data.description}
      style={{
        backgroundImage: `url(${data.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {data.name}
    </div>
  );
}
