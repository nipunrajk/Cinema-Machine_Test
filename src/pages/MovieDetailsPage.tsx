import { Link, useParams } from 'react-router-dom';
import { Card, CardBody } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { movies } from '../data/movies';
import { theatres } from '../data/theatres';
import { useSeatStore } from '../store/useSeatStore';
import { ArrowLeft, Theater } from 'lucide-react';

const tierPrice = {
  SILVER: 100,
  GOLD: 150,
  PLATINUM: 200,
};

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
      {/* Banner */}
      <div
        className='relative h-64 bg-cover bg-center rounded-lg overflow-hidden mb-6'
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url(${movie.posterUrl})`,
        }}
      >
        <div className='absolute inset-0 flex flex-col justify-end p-6 text-white'>
          <Link
            to='/'
            className='absolute top-6 left-6 flex items-center gap-2 text-white hover:text-gray-200'
          >
            <ArrowLeft />
            Back
          </Link>
          <h1 className='text-3xl font-bold mb-1'>{movie.title}</h1>
          <p className='text-base'>{movie.synopsis}</p>
        </div>
      </div>

      <div>
        {/* About section */}
        <Card
          style={{
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            marginBottom: '32px',
          }}
        >
          <CardBody>
            <h2 className='text-xl font-semibold mb-3'>About the Movie</h2>
            <p className='text-slate-600 leading-relaxed'>
              {movie.fullSynopsis}
            </p>
          </CardBody>
        </Card>

        <div className='mb-4'>
          <h2 className='text-2xl font-semibold mb-2'>Select Theatre</h2>
          <p className='text-slate-600 text-sm'>Choose your preferred cinema</p>
        </div>

        <div className='grid md:grid-cols-2 gap-6'>
          {theatres.map((theatre) => {
            // Calculate tier row counts
            const tierCounts = theatre.tierBands.map((band) => ({
              tier: band.tier,
              rows: band.toRow - band.fromRow + 1,
            }));

            return (
              <Card
                key={theatre.id}
                style={{
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  borderRadius: '8px',
                }}
              >
                <CardBody>
                  <div className='flex items-start gap-3 mb-4'>
                    <div className='w-10 h-10 bg-blue-100 rounded flex items-center justify-center shrink-0'>
                      <Theater className='text-blue-600' />
                    </div>
                    <div>
                      <h3 className='font-semibold text-lg'>{theatre.name}</h3>
                      <p className='text-sm text-slate-500'>
                        Total {theatre.rows} rows
                      </p>
                    </div>
                  </div>

                  {/* Tier breakdown */}
                  <div className='space-y-3 mb-4'>
                    {tierCounts.map(({ tier, rows }) => (
                      <div
                        key={tier}
                        className='flex items-center justify-between'
                      >
                        <div className='flex items-center gap-2'>
                          <div
                            className={`w-4 h-4 rounded ${
                              tier === 'SILVER'
                                ? 'bg-slate-400'
                                : tier === 'GOLD'
                                ? 'bg-yellow-400'
                                : 'bg-purple-400'
                            }`}
                          />
                          <span className='text-sm text-slate-700'>
                            {tier.charAt(0) + tier.slice(1).toLowerCase()}
                          </span>
                        </div>
                        <div className='text-right'>
                          <div className='text-sm text-slate-500'>
                            {rows} rows
                          </div>
                          <div className='text-sm font-medium'>
                            ₹{tierPrice[tier]}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={`/movies/${movie.id}/theatres/${theatre.id}`}
                    onClick={() => {
                      setMovie(movie.id);
                      setTheatre(theatre.id);
                    }}
                    style={{ display: 'block' }}
                  >
                    <Button
                      themeColor='primary'
                      fillMode='solid'
                      style={{ width: '100%' }}
                    >
                      Select Theatre
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
