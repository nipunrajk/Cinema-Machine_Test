// src/data/theatres.ts
import type { Theatre } from '../types';

/**
 * Pricing per tier (kept here for clarity)
 * SILVER -> 100, GOLD -> 150, PLATINUM -> 200
 */

export const theatres: Theatre[] = [
  {
    id: 'abc',
    name: 'ABC-Multiplex',
    rows: 9, // A..I
    seatsPerRow: 10,
    // rows 0..2 => SILVER, 3..5 => GOLD, 6..8 => PLATINUM
    tierBands: [
      { fromRow: 0, toRow: 2, tier: 'SILVER' },
      { fromRow: 3, toRow: 5, tier: 'GOLD' },
      { fromRow: 6, toRow: 8, tier: 'PLATINUM' },
    ],
    bookedSeats: ['A3', 'A4', 'C7', 'H2'], // sample booked seats for demo
  },
  {
    id: 'xyz',
    name: 'XYZ-Multiplex',
    rows: 12, // A..L
    seatsPerRow: 10,
    // rows 0..2 => SILVER, 3..7 => GOLD, 8..11 => PLATINUM
    tierBands: [
      { fromRow: 0, toRow: 2, tier: 'SILVER' },
      { fromRow: 3, toRow: 7, tier: 'GOLD' },
      { fromRow: 8, toRow: 11, tier: 'PLATINUM' },
    ],
    bookedSeats: ['B5', 'D10', 'J1'], // sample booked seats
  },
];
