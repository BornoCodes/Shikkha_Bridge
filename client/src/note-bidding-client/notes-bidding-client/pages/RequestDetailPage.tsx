import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import type { Bid, BidForm, NoteRequest } from '../types';
import RequestProgress from '../components/RequestProgress';

const emptyForm: BidForm = { price: 0, deliveryDays: 1, pitch: '', samplePage: '' };

export default function RequestDetailPage() {
  const id = Number(useParams().id);
  const [request, setRequest] = useState<NoteRequest | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [form, setForm] = useState<BidForm>(emptyForm);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const r = await api.getRequest(id);
      setRequest(r);
      // bids exist only after bidding opens
      setBids(r.status === 'collecting_requests' ? [] : await api.listBids(id));
    } catch (e: any) {
      setError(e.message);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  // One helper for every button: run the action, show errors, reload the data.
  async function run(action: () => Promise<unknown>) {
    setError('');
    try {
      await action();
      await load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  if (!request) return <p className="p-4">{error || 'Loading...'}</p>;

  const collecting = request.status === 'collecting_requests';
  const bidding = request.status === 'bidding_open';

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <h1 className="text-2xl font-bold">{request.topic}</h1>
      <RequestProgress count={request.requestCount} threshold={request.threshold} status={request.status} />
      {error && <p className="text-red-600">{error}</p>}

      {/* Step 1/2: request or cancel while collecting */}
      {collecting && (
        request.hasRequested ? (
          <button className="rounded border px-4 py-2" onClick={() => run(() => api.cancelRequest(id))}>
            Cancel Request
          </button>
        ) : (
          <button className="rounded bg-green-600 px-4 py-2 text-white"
                  onClick={() => run(() => api.requestNotes(request.topic))}>
            Request Notes
          </button>
        )
      )}

      {/* Step 3: place bid (the server rejects requesters and late bids) */}
      {bidding && !request.hasRequested && (
        <div className="space-y-2 rounded border p-3">
          <h2 className="font-semibold">Place Bid</h2>
          <input type="number" className="w-full rounded border p-2" placeholder="Price (credits)"
                 onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          <input type="number" className="w-full rounded border p-2" placeholder="Delivery time (days)"
                 onChange={(e) => setForm({ ...form, deliveryDays: Number(e.target.value) })} />
          <textarea className="w-full rounded border p-2" placeholder="Short pitch"
                    onChange={(e) => setForm({ ...form, pitch: e.target.value })} />
          <textarea className="w-full rounded border p-2" placeholder="Sample page (text)"
                    onChange={(e) => setForm({ ...form, samplePage: e.target.value })} />
          <button className="rounded bg-green-600 px-4 py-2 text-white"
                  onClick={() => run(() => api.placeBid(id, form))}>
            Submit Bid
          </button>
        </div>
      )}

      {/* Step 4: compare bids, requester accepts one */}
      {!collecting && (
        <div>
          <h2 className="mb-2 font-semibold">Bids</h2>
          <ul className="space-y-2">
            {bids.filter((b) => b.status !== 'withdrawn').map((b) => (
              <li key={b.id} className="rounded border p-3">
                <p className="font-medium">{b.price} credits · {b.deliveryDays} day(s) · {b.status}</p>
                <p className="text-sm">{b.pitch}</p>
                <details className="text-sm text-gray-600">
                  <summary>Preview Sample</summary>
                  <p className="whitespace-pre-wrap">{b.samplePage}</p>
                </details>

                {request.isOwner && bidding && b.status === 'pending' && (
                  <div className="mt-2 flex gap-2">
                    <button className="rounded bg-green-600 px-3 py-1 text-white"
                            onClick={() => run(() => api.acceptBid(id, b.id))}>Accept</button>
                    <button className="rounded border px-3 py-1"
                            onClick={() => run(() => api.rejectBid(id, b.id))}>Reject</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
