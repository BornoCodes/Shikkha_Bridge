// All HTTP calls live here, so the pages stay simple.
import type { Bid, BidForm, NoteRequest } from './types';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// TODO: use however your auth module stores the JWT (key name may differ)
const token = () => localStorage.getItem('token') ?? '';

async function call<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token()}`,
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message ?? 'Something went wrong');
  return body as T;
}

export const api = {
  listRequests: () => call<NoteRequest[]>('/note-requests'),
  getRequest: (id: number) => call<NoteRequest>(`/note-requests/${id}`),
  requestNotes: (topic: string) =>
    call<NoteRequest>('/note-requests', { method: 'POST', body: JSON.stringify({ topic }) }),
  cancelRequest: (id: number) => call(`/note-requests/${id}/request`, { method: 'DELETE' }),

  listBids: (id: number) => call<Bid[]>(`/note-requests/${id}/bids`),
  placeBid: (id: number, form: BidForm) =>
    call<Bid>(`/note-requests/${id}/bids`, { method: 'POST', body: JSON.stringify(form) }),
  withdrawBid: (id: number, bidId: number) =>
    call(`/note-requests/${id}/bids/${bidId}`, { method: 'DELETE' }),
  acceptBid: (id: number, bidId: number) =>
    call(`/note-requests/${id}/bids/${bidId}/accept`, { method: 'POST' }),
  rejectBid: (id: number, bidId: number) =>
    call(`/note-requests/${id}/bids/${bidId}/reject`, { method: 'POST' }),
};
