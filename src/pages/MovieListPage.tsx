import { Link } from 'react-router-dom';
import { Button } from '@progress/kendo-react-buttons';
import { movies } from '../data/movies';
import { useSeatStore } from '../store/useSeatStore';

export default function MovieListPage() {
  const setMovie = useSeatStore((s) => s.setMovie);

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold mb-2'>Now Showing</h1>
        <p className='text-slate-600'>Select a movie to book your seats</p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6'>
        {movies.map((movie) => (
          <div
            key={movie.id}
            className='bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200'
          >
            {/* Poster */}
            <div className='aspect-3/4 bg-slate-200 overflow-hidden'>
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className='w-full h-full object-cover'
              />
            </div>

            {/* Info */}
            <div className='p-4'>
              <h3 className='text-base font-semibold mb-1 text-slate-900 line-clamp-1'>
                {movie.title}
              </h3>
              <p className='text-sm text-slate-600 mb-3'>{movie.synopsis}</p>

              {/* Button */}
              <Link
                to={`/movies/${movie.id}`}
                onClick={() => setMovie(movie.id)}
                className='block'
              >
                <Button
                  themeColor='primary'
                  fillMode='solid'
                  style={{
                    width: '100%',
                    fontSize: '14px',
                    padding: '8px 16px',
                  }}
                >
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
