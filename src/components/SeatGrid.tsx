import { useMemo } from 'react';
import type { Seat } from '../types';
import SeatComponent from './Seat';

type Props = {
  seats: Seat[]; // flat array in row-major order
  selectedIds: string[];
  onToggleSeat: (seatId: string) => void;
};

export default function SeatGrid({ seats, selectedIds, onToggleSeat }: Props) {
  // compute number of columns from seats (find max colIndex)
  const cols = useMemo(() => {
    if (!seats.length) return 8;
    const maxCol = seats.reduce((acc, s) => Math.max(acc, s.colIndex), 0);
    return maxCol + 1;
  }, [seats]);

  // group seats by row to show row labels optionally
  const rows = useMemo(() => {
    const map = new Map<number, Seat[]>();
    seats.forEach((s) => {
      const arr = map.get(s.rowIndex) ?? [];
      arr.push(s);
      map.set(s.rowIndex, arr);
    });
    // sort rows by index ascending
    return Array.from(map.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([, v]) => v);
  }, [seats]);

  return (
    <div className='w-full'>
      <div className='mb-3 flex items-center gap-3 text-sm text-slate-600'>
        <div className='flex items-center gap-1'>
          <span className='w-3 h-3 bg-slate-200 rounded-sm inline-block' />{' '}
          Silver ₹100
        </div>
        <div className='flex items-center gap-1'>
          <span className='w-3 h-3 bg-yellow-200 rounded-sm inline-block' />{' '}
          Gold ₹150
        </div>
        <div className='flex items-center gap-1'>
          <span className='w-3 h-3 bg-pink-200 rounded-sm inline-block' />{' '}
          Platinum ₹200
        </div>
      </div>

      <div className='overflow-auto'>
        <div
          role='grid'
          aria-colcount={cols}
          aria-rowcount={rows.length}
          className='grid gap-2'
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(36px, 1fr))`,
          }}
        >
          {seats.map((seat) => (
            <div
              key={seat.id}
              className='flex items-center justify-center'
              role='presentation'
            >
              <SeatComponent
                seat={seat}
                selected={selectedIds.includes(seat.id)}
                onToggle={onToggleSeat}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Row labels (A B C...) under the grid for clarity on small screens */}
      <div className='mt-3 text-xs text-slate-500'>
        Rows:{' '}
        {rows
          .map((r) => r[0]?.id?.slice?.(0, 1))
          .filter(Boolean)
          .join(' ')}
      </div>
    </div>
  );
}
