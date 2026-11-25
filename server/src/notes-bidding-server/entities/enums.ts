// Statuses from your feature document:
// collecting_requests -> bidding_open -> bid_accepted -> delivered -> completed
export enum RequestStatus {
  COLLECTING = 'collecting_requests',
  BIDDING_OPEN = 'bidding_open',
  BID_ACCEPTED = 'bid_accepted',
  DELIVERED = 'delivered',   // later sprint
  COMPLETED = 'completed',   // later sprint
}

export enum BidStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}
