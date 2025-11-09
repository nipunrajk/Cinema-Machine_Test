import { useParams, Link } from 'react-router-dom';

export default function MovieDetailsPage() {
  const { movieId } = useParams<{ movieId: string }>();

  // Placeholder — later replace with movie lookup by id from seed data
  return (
    <div>
      <h1 className='text-3xl font-semibold mb-4'>Movie: {movieId}</h1>

      <div className='grid md:grid-cols-2 gap-6'>
        <div className='bg-white rounded shadow p-4'>
          <div className='h-64 bg-slate-200 rounded mb-4 flex items-center justify-center text-slate-500'>
            Poster
          </div>
          <p className='text-slate-700'>
            Short synopsis for <strong>{movieId}</strong>. Replace this with
            real data from <code>src/data/movies.ts</code>.
          </p>
        </div>

        <div className='space-y-4'>
          <h2 className='text-xl font-medium'>Choose Theatre</h2>

          <div className='bg-white rounded shadow p-4 flex items-center justify-between'>
            <div>
              <div className='font-semibold'>ABC-Multiplex</div>
              <div className='text-sm text-slate-500'>
                9 rows — Silver/Gold/Platinum
              </div>
            </div>
            <Link
              to={`/movies/${movieId}/theatres/abc`}
              className='text-sm bg-blue-600 text-white px-3 py-1 rounded'
            >
              Select seats
            </Link>
          </div>

          <div className='bg-white rounded shadow p-4 flex items-center justify-between'>
            <div>
              <div className='font-semibold'>XYZ-Multiplex</div>
              <div className='text-sm text-slate-500'>
                12 rows — Silver/Gold/Platinum
              </div>
            </div>
            <Link
              to={`/movies/${movieId}/theatres/xyz`}
              className='text-sm bg-blue-600 text-white px-3 py-1 rounded'
            >
              Select seats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
