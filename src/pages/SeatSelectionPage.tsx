import { useMemo, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import { theatres } from '../data/theatres';
import type { Seat } from '../types';
import SeatGrid from '../components/SeatGrid';
import SelectionSummary from '../components/SelectionSummary';
import BookingTimer from '../components/BookingTimer';
import TimerExpiredModal from '../components/TimerExpiredModal';
import { useSeatStore } from '../store/useSeatStore';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

export default function SeatSelectionPage() {
  const params = useParams();
  const navigate = useNavigate();
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

  // Toaster
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

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
        <Link
          to={`/movies/${movieId}`}
          className='flex items-center gap-2 text-slate-600 hover:text-slate-900'
        >
          <ArrowLeft className='w-5 h-5' />
          Back to movie
        </Link>
      </div>

      <BookingTimer />

      <div className='flex flex-col lg:flex-row gap-4 lg:gap-6'>
        <div className='flex-1 bg-white rounded-lg border border-slate-200 p-4 lg:p-6'>
          <SeatGrid
            seats={seats}
            selectedIds={selectedIds}
            onToggleSeat={toggleSeat}
          />
        </div>

        <div className='w-full lg:w-80'>
          <SelectionSummary
            selectedSeats={selectedSeats}
            onBook={bookSelected}
            onClear={clearSelection}
          />
        </div>
      </div>

      <TimerExpiredModal />
    </div>
  );
}
