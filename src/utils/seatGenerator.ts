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

export function generateSeats(theatre: Theatre): Seat[] {
  const seats: Seat[] = [];

  for (let r = 0; r < theatre.rows; r++) {
    const rowLetter = String.fromCharCode(65 + r);
    const tier = getTierForRow(r, theatre);

    for (let c = 0; c < theatre.seatsPerRow; c++) {
      const id = `${rowLetter}${c + 1}`;
      const price = tierPrice[tier];

      seats.push({
        id,
        rowIndex: r,
        colIndex: c,
        tier,
        price,
        status: 'available',
      });
    }
  }

  return seats;
}
