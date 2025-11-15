import { useEffect, useState } from 'react';
import { useSeatStore } from '../store/useSeatStore';
import { Clock } from 'lucide-react';

const TIMER_DURATION = 300; // 5 minutes in seconds
const WARNING_THRESHOLD = 60; // 1 minute in seconds

export default function BookingTimer() {
  const timerStartTime = useSeatStore((s) => s.timerStartTime);
  const expireTimer = useSeatStore((s) => s.expireTimer);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (!timerStartTime) {
      setRemainingSeconds(null);
      return;
    }

    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - timerStartTime) / 1000);
      const remaining = TIMER_DURATION - elapsed;

      if (remaining <= 0) {
        setRemainingSeconds(0);
        expireTimer();
        return;
      }

      setRemainingSeconds(remaining);
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [timerStartTime, expireTimer]);

  if (remainingSeconds === null) {
    return null;
  }

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const isWarning = remainingSeconds <= WARNING_THRESHOLD;

  return (
    <div
      className={`rounded-lg p-4 mb-4 flex items-start gap-3 transition-colors duration-300 ${
        isWarning
          ? 'bg-red-50 border border-red-200'
          : 'bg-blue-50 border border-blue-200'
      }`}
    >
      <div className='shrink-0 mt-0.5'>
        <Clock className='text-blue-900' />
      </div>

      <div className='flex-1'>
        <div className='flex items-center justify-between'>
          <div>
            <p
              className={`text-sm font-medium ${
                isWarning ? 'text-red-900' : 'text-blue-900'
              }`}
            >
              Time remaining to complete booking
            </p>
            <p
              className={`text-xs mt-0.5 ${
                isWarning ? 'text-red-700' : 'text-blue-700'
              }`}
            >
              Your seats will be released after the timer expires
            </p>
          </div>
          <div
            className={`text-2xl font-bold tabular-nums ${
              isWarning ? 'text-red-600' : 'text-blue-600'
            }`}
          >
            {timeString}
          </div>
        </div>
      </div>
    </div>
  );
}
