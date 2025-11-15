import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const signIn = useAuthStore((s) => s.signIn);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn(email, password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      navigate('/');
    }
  }

  function fillTestUser(userNumber: 1 | 2) {
    setEmail(`user${userNumber}@test.com`);
    setPassword('password123');
    setError('');
  }

  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-lg shadow-lg p-8'>
          <div className='flex items-center justify-center mb-6'>
            <h1 className='text-2xl font-semibold'>Login</h1>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-slate-700 mb-1'
              >
                Email
              </label>
              <input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-500'
                placeholder='user@example.com'
              />
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-slate-700 mb-1'
              >
                Password
              </label>
              <input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-500'
                placeholder='password'
              />
            </div>

            {error && (
              <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm'>
                {error}
              </div>
            )}

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className='mt-6 pt-6 border-t border-slate-200'>
            <p className='text-sm text-slate-600 mb-3 text-center'>
              Test Users (for demo):
            </p>
            <div className='flex gap-2'>
              <button
                type='button'
                onClick={() => fillTestUser(1)}
                className='flex-1 px-3 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 text-sm'
              >
                User 1
              </button>
              <button
                type='button'
                onClick={() => fillTestUser(2)}
                className='flex-1 px-3 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 text-sm'
              >
                User 2
              </button>
            </div>
            <p className='text-xs text-slate-500 mt-2 text-center'>
              Click to auto-fill credentials
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
