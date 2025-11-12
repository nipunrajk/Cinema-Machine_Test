import { generateSeats } from '../utils/seatGenerator';
import { theatres } from '../data/theatres';

test('generateSeats produces correct count and first/last IDs for ABC theatre', () => {
  const theatre = theatres.find((t) => t.id === 'abc')!;
  const seats = generateSeats(theatre);

  expect(seats.length).toBe(theatre.rows * theatre.seatsPerRow);
  expect(seats[0].id).toBe('A1');
  const lastRowLetter = String.fromCharCode(65 + theatre.rows - 1);
  const lastSeatId = `${lastRowLetter}${theatre.seatsPerRow}`;
  expect(seats[seats.length - 1].id).toBe(lastSeatId);
});
