export type Tier = 'SILVER' | 'GOLD' | 'PLATINUM';

export interface Movie {
  id: string;
  title: string;
  posterUrl?: string;
  synopsis?: string;
  fullSynopsis?: string;
}

export interface TierBand {
  fromRow: number; // inclusive, 0-based row index
  toRow: number; // inclusive, 0-based row index
  tier: Tier;
}

export interface Theatre {
  id: string;
  name: string;
  rows: number; // number of rows (e.g., 9)
  seatsPerRow: number; // number of seats per row (e.g., 10)
  tierBands: TierBand[]; // bands covering all rows
  bookedSeats?: string[]; // optional list of seat IDs that should render as booked (A3, B7...)
}

export type SeatStatus = 'available' | 'booked';

export interface Seat {
  id: string; // A1, B10 etc
  rowIndex: number; // 0-based
  colIndex: number; // 0-based
  tier: Tier;
  price: number;
  status: SeatStatus;
}
