// src/components/Seat.tsx
import React from 'react';
import type { Seat as SeatType } from '../types';

type Props = {
  seat: SeatType;
  selected: boolean;
  onToggle: (seatId: string) => void;
};

const tierBg: Record<string, string> = {
  SILVER: 'bg-slate-200 text-slate-800',
  GOLD: 'bg-yellow-200 text-yellow-900',
  PLATINUM: 'bg-pink-200 text-pink-900',
};

export default function Seat({ seat, selected, onToggle }: Props) {
  const disabled = seat.status === 'booked';

  const base =
    'w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded cursor-pointer select-none font-medium';
  const classes = [
    base,
    disabled
      ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
      : tierBg[seat.tier],
    selected ? 'ring-2 ring-offset-1 ring-blue-500 scale-105' : '',
  ].join(' ');

  const ariaLabel = `Seat ${seat.id}, ${seat.tier}, ₹${seat.price}, ${
    seat.status === 'booked' ? 'booked' : selected ? 'selected' : 'available'
  }`;

  return (
    <button
      aria-label={ariaLabel}
      aria-pressed={selected}
      title={`${seat.id} — ${seat.tier} — ₹${seat.price}`}
      disabled={disabled}
      onClick={() => !disabled && onToggle(seat.id)}
      className={classes}
    >
      <span className='text-xs md:text-sm'>{seat.id}</span>
    </button>
  );
}
