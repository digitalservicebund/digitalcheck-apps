type DetailInfoProps = {
  items: Record<string, string>;
};

export default function DetailInfo({ items }: DetailInfoProps) {
  return (
    <div className="bg-gray-100 inline-flex space-x-16">
      {Object.entries(items).map(([label, value], index) => (
        <div key={index} className="flex items-center space-x-4">
          <span>{label}: </span>
          <span>
            <b>{value}</b>
          </span>
        </div>
      ))}
    </div>
  );
}
