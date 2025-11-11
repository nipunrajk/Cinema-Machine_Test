import { useMemo, useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

import { theatres } from '../data/theatres';
import { generateSeats } from '../utils/seatGenerator';
import type { Seat } from '../types';
import SeatGrid from '../components/SeatGrid';
import SelectionSummary from '../components/SelectionSummary';

export default function SeatSelectionPage() {
  const params = useParams();
  const movieId = params.movieId ?? '';
  const theatreId = params.theatreId ?? '';

  const theatre = useMemo(
    () => theatres.find((t) => t.id === theatreId),
    [theatreId]
  );
  // seatsState will allow us to mark seats as booked after a booking
  const [seatsState, setSeatsState] = useState<Seat[]>(() =>
    theatre ? generateSeats(theatre) : []
  );
  // selected seat ids
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const successRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (successMessage && successRef.current) {
      successRef.current.focus();
    }
  }, [successMessage]);

  // regenerate seats when theatre changes
  useEffect(() => {
    if (theatre) {
      setSeatsState(generateSeats(theatre));
      setSelectedIds([]);
      setError(null);
      setSuccessMessage(null);
    }
  }, [theatre]);

  // helpers
  const seatById = useMemo(() => {
    const m = new Map<string, Seat>();
    seatsState.forEach((s) => m.set(s.id, s));
    return m;
  }, [seatsState]);

  const selectedSeats = useMemo(
    () => selectedIds.map((id) => seatById.get(id)!).filter(Boolean),
    [selectedIds, seatById]
  );

  // toggle selection with max 8 logic
  const toggleSeat = (seatId: string) => {
    const seat = seatById.get(seatId);
    if (!seat) return;

    if (seat.status === 'booked') return; // can't select booked

    const already = selectedIds.includes(seatId);
    if (already) {
      setSelectedIds((s) => s.filter((x) => x !== seatId));
      return;
    }

    // selecting new seat
    if (selectedIds.length >= 8) {
      setError('You can only select up to 8 seats.');
      // clear error after 2.5s
      window.setTimeout(() => setError(null), 2500);
      return;
    }

    setSelectedIds((s) => [...s, seatId]);
  };

  const clearSelection = () => {
    setSelectedIds([]);
    setError(null);
  };

  const handleBook = () => {
    if (selectedIds.length === 0) return;
    // mark selected seats as booked in seatsState
    setSeatsState((prev) =>
      prev.map((s) =>
        selectedIds.includes(s.id) ? { ...s, status: 'booked' } : s
      )
    );
    setSuccessMessage(
      `Booked ${selectedIds.length} seat(s): ${selectedIds.join(', ')}.`
    );
    setSelectedIds([]);
    // clear success after a while
    window.setTimeout(() => setSuccessMessage(null), 4000);
  };

  if (!theatre) {
    return (
      <div>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-2xl font-semibold'>
            Seats — {movieId} / {theatreId}
          </h1>
          <Link
            to={`/movies/${movieId}`}
            className='text-sm text-slate-600 underline'
          >
            Back to movie
          </Link>
        </div>

        <div className='bg-white rounded shadow p-6'>
          <div className='text-slate-600'>Theatre not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-semibold'>
          Seats — {movieId} / {theatre.name}
        </h1>
        <Link
          to={`/movies/${movieId}`}
          className='text-sm text-slate-600 underline'
        >
          Back to movie
        </Link>
      </div>

      <div className='md:flex md:items-start md:gap-6'>
        {/* Seat grid */}
        <div className='md:flex-1 bg-white rounded shadow p-6'>
          <div className='mb-4 text-sm text-slate-600'>
            Click seats to select. Max 8 seats.
          </div>

          <SeatGrid
            seats={seatsState}
            selectedIds={selectedIds}
            onToggleSeat={toggleSeat}
          />

          {/* error / success aria-live regions */}
          <div
            tabIndex={-1}
            ref={successRef}
            aria-live='polite'
            className='mt-4'
          >
            <div
              aria-live='polite'
              className='min-h-[1.2rem] text-sm'
              id='seat-messages'
            >
              {error ? (
                <div className='text-sm text-red-600'>ss{error}</div>
              ) : null}
              {successMessage ? (
                <div className='text-sm text-green-600'>{successMessage}</div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Selection summary */}
        <div className='mt-4 md:mt-0'>
          <SelectionSummary
            selectedSeats={selectedSeats}
            onBook={handleBook}
            onClear={clearSelection}
          />
        </div>
      </div>
    </div>
  );
}
