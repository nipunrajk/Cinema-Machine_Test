// src/utils/seatGenerator.ts
import type { Seat, Theatre, Tier } from '../types';

const tierPrice = {
  SILVER: 100,
  GOLD: 150,
  PLATINUM: 200,
} as const;

function getTierForRow(rowIndex: number, theatre: Theatre): Tier {
  const band = theatre.tierBands.find(
    (b) => rowIndex >= b.fromRow && rowIndex <= b.toRow
  );
  if (!band) {
    // fallback to SILVER if config is malformed
    return 'SILVER';
  }
  return band.tier;
}

/**
 * Generate a deterministic seat list for the theatre.
 * Row letters: 0 -> 'A', 1 -> 'B', ...
 */
export function generateSeats(theatre: Theatre): Seat[] {
  const seats: Seat[] = [];
  const booked = new Set(theatre.bookedSeats ?? []);

  for (let r = 0; r < theatre.rows; r++) {
    const rowLetter = String.fromCharCode(65 + r); // A, B, C...
    const tier = getTierForRow(r, theatre);

    for (let c = 0; c < theatre.seatsPerRow; c++) {
      const id = `${rowLetter}${c + 1}`; // A1, A2, ...
      const price = tierPrice[tier];
      const status: Seat['status'] = booked.has(id) ? 'booked' : 'available';

      seats.push({
        id,
        rowIndex: r,
        colIndex: c,
        tier,
        price,
        status,
      });
    }
  }

  return seats;
}
