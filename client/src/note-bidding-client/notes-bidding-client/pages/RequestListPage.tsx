import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import type { NoteRequest } from '../types';
import RequestProgress from '../components/RequestProgress';

export default function RequestListPage() {
  const [requests, setRequests] = useState<NoteRequest[]>([]);
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');

  const load = () => api.listRequests().then(setRequests).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  async function submit() {
    setError('');
    try {
      await api.requestNotes(topic);
      setTopic('');
      load();
    } catch (e: any) {
      setError(e.message); // e.g. "You already requested this topic"
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Notes Marketplace</h1>

      <div className="mb-4 flex gap-2">
        <input
          className="flex-1 rounded border p-2"
          placeholder="Topic you want notes on"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button className="rounded bg-green-600 px-4 text-white" onClick={submit}>
          Request Notes
        </button>
      </div>
      {error && <p className="mb-2 text-red-600">{error}</p>}

      <ul className="space-y-3">
        {requests.map((r) => (
          <li key={r.id} className="rounded border p-3">
            <Link to={`/note-requests/${r.id}`} className="font-semibold underline">
              {r.topic}
            </Link>
            <RequestProgress count={r.requestCount} threshold={r.threshold} status={r.status} />
          </li>
        ))}
      </ul>
    </div>
  );
}
