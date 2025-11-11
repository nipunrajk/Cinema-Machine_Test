import { useMemo, useState } from 'react';
import type { Seat } from '../types';

type Props = {
  selectedSeats: Seat[]; // full seat objects for selected IDs
  onBook: () => void;
  onClear: () => void;
};

export default function SelectionSummary({
  selectedSeats,
  onBook,
  onClear,
}: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  const total = useMemo(
    () => selectedSeats.reduce((s, seat) => s + seat.price, 0),
    [selectedSeats]
  );

  return (
    <div className='w-full md:w-80'>
      <div className='bg-white rounded shadow p-4 space-y-3'>
        <h3 className='text-lg font-medium'>Selection Summary</h3>

        <div className='text-sm text-slate-600'>
          <div className='mb-2'>Selected ({selectedSeats.length})</div>

          {selectedSeats.length === 0 ? (
            <div className='text-xs text-slate-400'>No seats selected</div>
          ) : (
            <ul className='max-h-36 overflow-auto space-y-1'>
              {selectedSeats.map((s) => (
                <li key={s.id} className='flex justify-between text-sm'>
                  <span>
                    {s.id} · {s.tier}
                  </span>
                  <span>₹{s.price}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className='flex items-center justify-between pt-2 border-t'>
          <div className='text-sm text-slate-700 font-semibold'>Total</div>
          <div className='text-lg font-semibold'>₹{total}</div>
        </div>

        <div className='flex gap-2'>
          <button
            className='flex-1 bg-blue-600 text-white px-3 py-2 rounded disabled:opacity-60'
            onClick={() => setShowConfirm(true)}
            disabled={selectedSeats.length === 0}
            aria-disabled={selectedSeats.length === 0}
          >
            Book Now
          </button>

          <button
            className='px-3 py-2 rounded border text-sm'
            onClick={onClear}
            disabled={selectedSeats.length === 0}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Simple confirm modal (small) */}
      {showConfirm && (
        <div
          role='dialog'
          aria-modal='true'
          className='fixed inset-0 z-50 flex items-center justify-center p-4'
        >
          <div
            className='absolute inset-0 bg-black/40'
            onClick={() => setShowConfirm(false)}
          />
          <div className='relative bg-white rounded shadow p-6 w-full max-w-md z-10'>
            <h4 className='text-lg font-semibold'>Confirm booking</h4>
            <p className='mt-2 text-sm text-slate-700'>
              You are about to book {selectedSeats.length} seat(s) for{' '}
              <strong>₹{total}</strong>.
            </p>

            <div className='mt-4 flex justify-end gap-2'>
              <button
                className='px-3 py-2 rounded border'
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className='px-3 py-2 rounded bg-blue-600 text-white'
                onClick={() => {
                  setShowConfirm(false);
                  onBook();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
