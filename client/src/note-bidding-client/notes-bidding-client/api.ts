import type { Bid, BidForm, NoteRequest } from './types';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

const token = () =>
  localStorage.getItem('shikkha_bridge_token') ||
  localStorage.getItem('shikkha_token') ||
  '';

async function call<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token()}`,
      ...options.headers,
    },
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      typeof body.message === 'string'
        ? body.message
        : `Request failed (${res.status})`,
    );
  }

  return body as T;
}

function toArray<T>(body: unknown, label: string): T[] {
  if (Array.isArray(body)) return body;

  if (body && typeof body === 'object') {
    const obj = body as Record<string, unknown>;

    for (const key of ['data', 'items', 'requests', 'bids', 'results']) {
      const value = obj[key];

      if (Array.isArray(value)) return value as T[];

      if (value && typeof value === 'object') {
        const nested = value as Record<string, unknown>;

        for (const nestedKey of ['data', 'items', 'requests', 'bids', 'results']) {
          if (Array.isArray(nested[nestedKey])) {
            return nested[nestedKey] as T[];
          }
        }
      }
    }
  }

  throw new Error(`Invalid ${label} response: expected an array from the server.`);
}

export const api = {
  listRequests: async () =>
    toArray<NoteRequest>(await call<unknown>('/note-requests'), 'requests'),

  getRequest: (id: number) =>
    call<NoteRequest>(`/note-requests/${id}`),

  requestNotes: (topic: string) =>
    call<NoteRequest>('/note-requests', {
      method: 'POST',
      body: JSON.stringify({ topic }),
    }),

  cancelRequest: (id: number) =>
    call(`/note-requests/${id}/request`, { method: 'DELETE' }),

  listBids: async (id: number) =>
    toArray<Bid>(await call<unknown>(`/note-requests/${id}/bids`), 'bids'),

  placeBid: (id: number, form: BidForm) =>
    call<Bid>(`/note-requests/${id}/bids`, {
      method: 'POST',
      body: JSON.stringify(form),
    }),

  withdrawBid: (id: number, bidId: number) =>
    call(`/note-requests/${id}/bids/${bidId}`, { method: 'DELETE' }),

  acceptBid: (id: number, bidId: number) =>
    call(`/note-requests/${id}/bids/${bidId}/accept`, { method: 'POST' }),

  rejectBid: (id: number, bidId: number) =>
    call(`/note-requests/${id}/bids/${bidId}/reject`, { method: 'POST' }),
};
