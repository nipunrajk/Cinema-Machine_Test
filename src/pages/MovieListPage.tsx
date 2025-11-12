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
          <div
            key={m.id}
            className='bg-white rounded shadow p-4 flex flex-col h-80'
          >
            <div className='h-48 bg-slate-200 rounded mb-3 overflow-hidden shrink-0'>
              <img
                src={m.posterUrl}
                alt={m.title}
                className='w-full h-full object-cover'
              />
            </div>
            <h3 className='font-medium mb-2 line-clamp-2 grow'>{m.title}</h3>
            <Link
              to={`/movies/${m.id}`}
              onClick={() => setMovie(m.id)}
              className='inline-block text-center text-sm text-white bg-blue-600 px-3 py-2 rounded hover:bg-blue-700'
            >
              View details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
