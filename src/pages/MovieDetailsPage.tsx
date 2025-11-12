import { Link, useParams } from 'react-router-dom';
import { movies } from '../data/movies';
import { theatres } from '../data/theatres';
import { useSeatStore } from '../store/useSeatStore';

export default function MovieDetailsPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const movie = movies.find((m) => m.id === movieId);
  const setTheatre = useSeatStore((s) => s.setTheatre);
  const setMovie = useSeatStore((s) => s.setMovie);

  if (!movie) {
    return (
      <div className='py-16 text-center'>
        <h2 className='text-2xl font-semibold'>Movie not found</h2>
        <Link to='/' className='mt-4 inline-block text-blue-600 underline'>
          Back to Movies
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to='/' className='text-blue-600 hover:underline mb-4 inline-block'>
        ← Back to Movies
      </Link>

      <div className='bg-white rounded shadow p-6 mb-6'>
        <div className='flex gap-6'>
          <div className='w-48 h-64 bg-slate-200 rounded overflow-hidden shrink-0'>
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className='w-full h-full object-cover'
            />
            )
          </div>
          <div>
            <h1 className='text-3xl font-semibold mb-3'>{movie.title}</h1>
            <p className='text-slate-600'>{movie.synopsis}</p>
          </div>
        </div>
      </div>

      <h2 className='text-2xl font-semibold mb-4'>Select a Theatre</h2>
      <div className='grid gap-4'>
        {theatres.map((theatre) => (
          <div key={theatre.id} className='bg-white rounded shadow p-4'>
            <h3 className='font-medium text-lg mb-2'>{theatre.name}</h3>
            <p className='text-sm text-slate-600 mb-3'>
              {theatre.rows} rows × {theatre.seatsPerRow} seats
            </p>
            <Link
              to={`/movies/${movie.id}/theatres/${theatre.id}`}
              onClick={() => {
                setMovie(movie.id);
                setTheatre(theatre.id);
              }}
              className='inline-block text-sm text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700'
            >
              Select Seats
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
