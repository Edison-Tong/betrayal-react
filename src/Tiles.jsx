export default function Tile({ data }) {
  return (
    <div className={`tile ${data.id}`} title={data.description}>
      {data.name}
    </div>
  );
}
