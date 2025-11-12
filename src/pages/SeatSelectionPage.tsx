import { useMemo, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

import { theatres } from '../data/theatres';
import type { Seat } from '../types';
import SeatGrid from '../components/SeatGrid';
import SelectionSummary from '../components/SelectionSummary';
import { useSeatStore } from '../store/useSeatStore';

export default function SeatSelectionPage() {
  const params = useParams();
  const movieId = params.movieId ?? '';
  const theatreId = params.theatreId ?? '';

  // find theatre
  const theatre = useMemo(
    () => theatres.find((t) => t.id === theatreId),
    [theatreId]
  );

  // store selectors & actions
  const setTheatre = useSeatStore((s) => s.setTheatre);
  const seats = useSeatStore((s) => s.seats);
  const selectedIds = useSeatStore((s) => s.selectedIds);
  const toggleSeat = useSeatStore((s) => s.toggleSeat);
  const clearSelection = useSeatStore((s) => s.clearSelection);
  const bookSelected = useSeatStore((s) => s.bookSelected);
  const error = useSeatStore((s) => s.error);
  const successMessage = useSeatStore((s) => s.successMessage);

  // focus for success messages
  const successRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (successMessage && successRef.current) {
      successRef.current.focus();
    }
  }, [successMessage]);

  // when theatreId changes, let the store generate seats
  useEffect(() => {
    if (theatreId) {
      setTheatre(theatreId);
    }
  }, [theatreId]);

  // computed lookups
  const seatById = useMemo(() => {
    const m = new Map<string, Seat>();
    seats.forEach((s) => m.set(s.id, s));
    return m;
  }, [seats]);

  const selectedSeats = useMemo(
    () => selectedIds.map((id) => seatById.get(id)!).filter(Boolean),
    [selectedIds, seatById]
  );

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
            seats={seats}
            selectedIds={selectedIds}
            onToggleSeat={toggleSeat}
          />

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
                <div className='text-sm text-red-600'>{error}</div>
              ) : null}
              {successMessage ? (
                <div className='text-sm text-green-600'>{successMessage}</div>
              ) : null}
            </div>
          </div>
        </div>

        <div className='mt-4 md:mt-0'>
          <SelectionSummary
            selectedSeats={selectedSeats}
            onBook={bookSelected}
            onClear={clearSelection}
          />
        </div>
      </div>
    </div>
  );
}
