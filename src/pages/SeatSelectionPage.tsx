import { useParams, Link } from 'react-router-dom';

export default function SeatSelectionPage() {
  const { movieId, theatreId } = useParams<{
    movieId: string;
    theatreId: string;
  }>();

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
        {/* Placeholder grid — later replaced by SeatGrid */}
        <div className='text-slate-600'>
          Seat grid will render here (seat IDs A1…).
        </div>
        <div className='mt-4 text-sm text-slate-500'>
          Selection summary & Book Now button go to the right (or bottom on
          mobile).
        </div>
      </div>
    </div>
  );
}
