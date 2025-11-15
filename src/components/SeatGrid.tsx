import { useMemo } from 'react';
import type { Seat } from '../types';
import SeatComponent from './Seat';

type Props = {
  seats: Seat[]; 
  selectedIds: string[];
  onToggleSeat: (seatId: string) => void;
};

export default function SeatGrid({ seats, selectedIds, onToggleSeat }: Props) {
  // group seats by row to show row labels
  const rows = useMemo(() => {
    const map = new Map<number, Seat[]>();
    seats.forEach((s) => {
      const arr = map.get(s.rowIndex) ?? [];
      arr.push(s);
      map.set(s.rowIndex, arr);
    });
    // sort rows by index ascending and sort seats within each row
    return Array.from(map.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([rowIndex, rowSeats]) => ({
        rowIndex,
        seats: rowSeats.sort((a, b) => a.colIndex - b.colIndex),
        label: String.fromCharCode(65 + rowIndex), // A, B, C, etc.
      }));
  }, [seats]);

  return (
    <div className='w-full'>
      {/* Screen */}
      <div className='mb-4 lg:mb-6 text-center'>
        <div className='inline-block bg-slate-200 px-4 lg:px-6 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm text-slate-600 font-medium'>
          Screen
        </div>
      </div>

      {/* Seat grid with row labels */}
      <div className='space-y-1 lg:space-y-3 mb-6 lg:mb-8 overflow-x-auto'>
        <div className='min-w-fit mx-auto px-2'>
          {rows.map(({ rowIndex, seats: rowSeats, label }) => (
            <div
              key={rowIndex}
              className='flex items-center gap-1 lg:gap-4 mb-1 lg:mb-3'
            >
              {/* Row label */}
              <div className='w-4 lg:w-8 text-center text-xs lg:text-base font-medium text-slate-600 shrink-0'>
                {label}
              </div>

              {/* Seats in this row */}
              <div className='flex gap-0.5 lg:gap-3 justify-center'>
                {rowSeats.map((seat) => (
                  <SeatComponent
                    key={seat.id}
                    seat={seat}
                    selected={selectedIds.includes(seat.id)}
                    onToggle={onToggleSeat}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className='flex flex-wrap items-center justify-center gap-3 lg:gap-4 text-xs lg:text-sm'>
        <div className='flex items-center gap-1.5'>
          <div className='w-3 h-3 lg:w-4 lg:h-4 bg-slate-400 rounded' />
          <span className='text-slate-700'>Silver</span>
          <span className='text-slate-500'>₹100</span>
        </div>
        <div className='flex items-center gap-1.5'>
          <div className='w-3 h-3 lg:w-4 lg:h-4 bg-yellow-400 rounded' />
          <span className='text-slate-700'>Gold</span>
          <span className='text-slate-500'>₹150</span>
        </div>
        <div className='flex items-center gap-1.5'>
          <div className='w-3 h-3 lg:w-4 lg:h-4 bg-purple-500 rounded' />
          <span className='text-slate-700'>Platinum</span>
          <span className='text-slate-500'>₹200</span>
        </div>
        <div className='flex items-center gap-1.5'>
          <div className='w-3 h-3 lg:w-4 lg:h-4 bg-blue-500 rounded' />
          <span className='text-slate-700'>Selected</span>
        </div>
      </div>
    </div>
  );
}
