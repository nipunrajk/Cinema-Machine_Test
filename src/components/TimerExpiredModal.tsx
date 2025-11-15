import { Button } from '@progress/kendo-react-buttons';
import { useSeatStore } from '../store/useSeatStore';
import { Clock } from 'lucide-react';

export default function TimerExpiredModal() {
  const timerExpired = useSeatStore((s) => s.timerExpired);
  const acknowledgeExpiry = useSeatStore((s) => s.acknowledgeExpiry);

  if (!timerExpired) {
    return null;
  }

  return (
    <div
      role='dialog'
      aria-modal='true'
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50'
    >
      <div className='relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md'>
        <div className='flex justify-center mb-4'>
          <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center'>
            <Clock className='h-8 w-8 text-red-600' />
          </div>
        </div>

        <h3 className='text-xl font-semibold text-center mb-2'>
          Booking Time Expired
        </h3>
        <p className='text-sm text-slate-600 text-center mb-6'>
          Your selected seats have been released. Please select your seats again
          to continue with the booking.
        </p>

        <Button
          themeColor='primary'
          fillMode='solid'
          onClick={acknowledgeExpiry}
          style={{ width: '100%' }}
        >
          Select Seats Again
        </Button>
      </div>
    </div>
  );
}
