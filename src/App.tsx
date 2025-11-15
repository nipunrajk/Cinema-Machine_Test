import { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import MovieListPage from './pages/MovieListPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import MyBookingsPage from './pages/MyBookingsPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { initializeIdMappings } from './data/supabaseMapping';
import { useAuthStore } from './store/useAuthStore';
import { Ticket, LogOut } from 'lucide-react';

function Header() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <header className='bg-white shadow-sm p-4 sticky top-0 z-10'>
      <div className='max-w-7xl mx-auto flex items-center justify-between'>
        <Link to='/' className='flex items-center gap-2 text-slate-800'>
          <span className='text-lg font-semibold'>Cinema</span>
        </Link>
        <nav className='flex items-center gap-6 text-sm text-slate-600'>
          <Link to='/' className='hover:text-slate-900'>
            Movies
          </Link>
          {user && (
            <>
              <Link
                to='/bookings'
                className='flex items-center gap-1.5 hover:text-slate-900'
              >
                <Ticket className='w-4 h-4' />
                My Bookings
              </Link>
              <button
                onClick={() => signOut()}
                className='flex items-center gap-1.5 hover:text-slate-900'
              >
                <LogOut className='w-4 h-4' />
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function AppContent() {
  const location = useLocation();
  const showHeader = location.pathname !== '/login';

  return (
    <div className='min-h-screen bg-slate-50'>
      {showHeader && <Header />}
      <main className={showHeader ? 'max-w-7xl mx-auto p-6' : ''}>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <MovieListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/movies/:movieId'
            element={
              <ProtectedRoute>
                <MovieDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/movies/:movieId/theatres/:theatreId'
            element={
              <ProtectedRoute>
                <SeatSelectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/bookings'
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />

          {/* Not found */}
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
      <Toaster position='top-right' reverseOrder={false} />
    </div>
  );
}

export default function App() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
    initializeIdMappings();
  }, [initialize]);

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
