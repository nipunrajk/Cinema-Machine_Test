import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Ticket } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

type Booking = {
  id: string;
  movie_id: string;
  theatre_id: string;
  seat_ids: string[];
  total_amount: number;
  booking_code: string;
  status: string;
  created_at: string;
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  async function loadBookings() {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(
          `
          *,
          movies (title),
          theatres (name)
        `
        )
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  }

  function getMovieTitle(booking: any): string {
    return booking.movies?.title || 'Unknown Movie';
  }

  function getTheatreName(booking: any): string {
    return booking.theatres?.name || 'Unknown Theatre';
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (loading) {
    return (
      <div className='max-w-4xl mx-auto'>
        <div className='flex items-center gap-4 mb-6'>
          <Link
            to='/'
            className='flex items-center gap-2 text-slate-600 hover:text-slate-900'
          >
            <ArrowLeft className='w-5 h-5' />
            Back to Movies
          </Link>
        </div>
        <div className='text-center py-12'>
          <p className='text-slate-600'>Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <Ticket className='w-6 h-6 text-black' />
          <h1 className='text-2xl font-semibold'>My Bookings</h1>
        </div>
        <Link
          to='/'
          className='flex items-center gap-2 text-slate-600 hover:text-slate-900'
        >
          <ArrowLeft className='w-5 h-5' />
          Back to Movies
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className='bg-white rounded-lg border border-slate-200 p-12 text-center'>
          <Ticket className='w-12 h-12 text-slate-300 mx-auto mb-4' />
          <p className='text-slate-600 mb-4'>No bookings yet</p>
          <Link
            to='/'
            className='inline-block px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800'
          >
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className='space-y-4'>
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className='bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow'
            >
              <div className='flex items-start justify-between mb-4'>
                <div>
                  <h3 className='text-lg font-semibold text-slate-900 mb-1'>
                    {getMovieTitle(booking)}
                  </h3>
                  <p className='text-sm text-slate-600'>
                    {getTheatreName(booking)}
                  </p>
                </div>
                <div className='text-right'>
                  <div className='text-sm font-mono text-slate-500 mb-1'>
                    {booking.booking_code}
                  </div>
                  <div className='text-xs text-slate-400'>
                    {formatDate(booking.created_at)}
                  </div>
                </div>
              </div>

              <div className='flex items-center justify-between pt-4 border-t border-slate-100'>
                <div>
                  <p className='text-sm text-slate-600 mb-1'>Seats</p>
                  <div className='flex flex-wrap gap-2'>
                    {booking.seat_ids.map((seatId) => (
                      <span
                        key={seatId}
                        className='px-2 py-1 bg-slate-100 text-slate-700 text-sm rounded'
                      >
                        {seatId}
                      </span>
                    ))}
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-sm text-slate-600 mb-1'>Total</p>
                  <p className='text-xl font-semibold text-slate-900'>
                    ₹{booking.total_amount}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
