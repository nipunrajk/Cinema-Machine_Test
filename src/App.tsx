import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import MovieListPage from './pages/MovieListPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import SeatSelectionPage from './pages/SeatSelectionPage';

/**
 * Small header used across pages — keeps things simple for the assignment test.
 */
function Header() {
  return (
    <header className='bg-white shadow-sm p-4 sticky top-0 z-10'>
      <div className='max-w-6xl mx-auto flex items-center justify-between'>
        <Link to='/' className='text-2xl font-bold text-slate-800'>
          Cinema
        </Link>
        <nav className='text-sm text-slate-600'>
          <Link to='/' className='mr-4 hover:underline'>
            Movies
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className='min-h-screen bg-slate-50'>
        <Header />
        <main className='max-w-6xl mx-auto p-4'>
          <Routes>
            <Route path='/' element={<MovieListPage />} />
            <Route path='/movies/:movieId' element={<MovieDetailsPage />} />
            <Route
              path='/movies/:movieId/theatres/:theatreId'
              element={<SeatSelectionPage />}
            />
            {/* Simple fallback route */}
            <Route
              path='*'
              element={
                <div className='py-16 text-center'>
                  <h2 className='text-2xl font-semibold'>404 — Not found</h2>
                  <p className='mt-4'>
                    This page doesn't exist.{' '}
                    <Link to='/' className='text-blue-600 underline'>
                      Back to Movies
                    </Link>
                  </p>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
