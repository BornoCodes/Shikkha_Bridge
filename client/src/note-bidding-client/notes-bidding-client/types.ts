export type RequestStatus =
  | 'collecting_requests' | 'bidding_open' | 'bid_accepted' | 'delivered' | 'completed';

export interface NoteRequest {
  id: number;
  topic: string;
  description: string | null;
  status: RequestStatus;
  threshold: number;
  requestCount: number;
  biddingDeadline: string | null;
  acceptedBidId: number | null;
  hasRequested?: boolean; // only on the detail endpoint
  isOwner?: boolean;      // only on the detail endpoint
}

export interface Bid {
  id: number;
  writerId: number;
  price: number;
  deliveryDays: number;
  pitch: string;
  samplePage: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
}

export interface BidForm {
  price: number;
  deliveryDays: number;
  pitch: string;
  samplePage: string;
}
