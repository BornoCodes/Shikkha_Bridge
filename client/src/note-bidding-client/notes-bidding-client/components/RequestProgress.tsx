// Progress bar: "7/10 requests until bidding opens"
interface Props {
  count: number;
  threshold: number;
  status: string;
}

export default function RequestProgress({ count, threshold, status }: Props) {
  const percent = Math.min(100, Math.round((count / threshold) * 100));
  const collecting = status === 'collecting_requests';

  return (
    <div>
      <div className="h-3 w-full rounded bg-gray-200">
        <div className="h-3 rounded bg-green-600" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-1 text-sm text-gray-600">
        {collecting
          ? `${count}/${threshold} requests until bidding opens`
          : `Bidding opened (${count} requests)`}
      </p>
    </div>
  );
}
