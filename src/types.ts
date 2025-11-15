export type Tier = 'SILVER' | 'GOLD' | 'PLATINUM';

export interface Movie {
  id: string;
  title: string;
  posterUrl?: string;
  synopsis?: string;
  fullSynopsis?: string;
}

export interface TierBand {
  fromRow: number;
  toRow: number;
  tier: Tier;
}

export interface Theatre {
  id: string;
  name: string;
  rows: number;
  seatsPerRow: number;
  tierBands: TierBand[];
}

export type SeatStatus = 'available' | 'booked';

export interface Seat {
  id: string;
  rowIndex: number;
  colIndex: number;
  tier: Tier;
  price: number;
  status: SeatStatus;
}
