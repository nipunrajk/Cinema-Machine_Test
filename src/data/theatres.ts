import type { Theatre } from '../types';

export const theatres: Theatre[] = [
  {
    id: 'abc',
    name: 'ABC-Multiplex',
    rows: 9,
    seatsPerRow: 10,
    tierBands: [
      { fromRow: 0, toRow: 2, tier: 'SILVER' },
      { fromRow: 3, toRow: 5, tier: 'GOLD' },
      { fromRow: 6, toRow: 8, tier: 'PLATINUM' },
    ],
    bookedSeats: ['A3', 'A4', 'C7', 'H2'], // sample booked seats
  },
  {
    id: 'xyz',
    name: 'XYZ-Multiplex',
    rows: 12,
    seatsPerRow: 10,
    tierBands: [
      { fromRow: 0, toRow: 2, tier: 'SILVER' },
      { fromRow: 3, toRow: 7, tier: 'GOLD' },
      { fromRow: 8, toRow: 11, tier: 'PLATINUM' },
    ],
    bookedSeats: ['B5', 'D10', 'J1'], // sample booked seats
  },
];
