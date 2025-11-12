import { Link } from 'react-router-dom';
import { movies } from '../data/movies';
import { useSeatStore } from '../store/useSeatStore';

export default function MovieListPage() {
  const setMovie = useSeatStore((s) => s.setMovie);

  return (
    <div>
      <h1 className='text-3xl font-semibold mb-6'>Movies</h1>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {movies.map((m) => (
          <div key={m.id} className='bg-white rounded shadow p-4'>
            <div className='h-40 bg-slate-200 rounded mb-3 flex items-center justify-center text-slate-500'>
              Poster
            </div>
            <h3 className='font-medium'>{m.title}</h3>
            <Link
              to={`/movies/${m.id}`}
              onClick={() => setMovie(m.id)}
              className='inline-block mt-3 text-sm text-white bg-blue-600 px-3 py-1 rounded'
            >
              View details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
