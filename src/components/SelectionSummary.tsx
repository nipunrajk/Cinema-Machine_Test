import { useMemo, useState } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import type { Seat } from '../types';

type Props = {
  selectedSeats: Seat[];
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
    <div className='w-full'>
      <div className='bg-white rounded-lg border border-slate-200 p-4 lg:p-6 space-y-3 lg:space-y-4'>
        <h3 className='text-base lg:text-lg font-semibold'>Booking Summary</h3>

        <div className='min-h-[80px] lg:min-h-[120px]'>
          {selectedSeats.length === 0 ? (
            <div className='flex items-center justify-center h-full text-slate-400 text-sm'>
              No seats selected
            </div>
          ) : (
            <div className='space-y-1.5 lg:space-y-2 max-h-32 lg:max-h-40 overflow-y-auto'>
              {selectedSeats.map((s) => (
                <div key={s.id} className='flex justify-between text-sm'>
                  <span className='text-slate-700'>
                    {s.id} · {s.tier.charAt(0) + s.tier.slice(1).toLowerCase()}
                  </span>
                  <span className='font-medium'>₹{s.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedSeats.length > 0 && (
          <div className='flex items-center justify-between pt-2 lg:pt-3 border-t'>
            <div className='text-slate-700 font-medium'>Total</div>
            <div className='text-lg lg:text-xl font-semibold'>₹{total}</div>
          </div>
        )}

        <div className='flex gap-2 pt-1 lg:pt-2'>
          <Button
            themeColor='primary'
            fillMode='solid'
            style={{ flex: 1 }}
            onClick={() => setShowConfirm(true)}
            disabled={selectedSeats.length === 0}
          >
            Book Now
          </Button>

          <Button
            fillMode='outline'
            onClick={onClear}
            disabled={selectedSeats.length === 0}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* confirm modal */}
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
              <Button fillMode='outline' onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button
                themeColor='primary'
                fillMode='solid'
                onClick={() => {
                  setShowConfirm(false);
                  onBook();
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
