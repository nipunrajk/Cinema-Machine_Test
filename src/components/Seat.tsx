import type { Seat as SeatType } from '../types';

type Props = {
  seat: SeatType;
  selected: boolean;
  onToggle: (seatId: string) => void;
};

const tierBg: Record<string, string> = {
  SILVER: 'bg-slate-400',
  GOLD: 'bg-yellow-400',
  PLATINUM: 'bg-purple-500',
};

export default function Seat({ seat, selected, onToggle }: Props) {
  const disabled = seat.status === 'booked';

  const base =
    'w-7 h-5 lg:w-16 lg:h-8 rounded cursor-pointer select-none transition-all duration-200';

  let classes = base;
  if (disabled) {
    classes += ' bg-slate-300 cursor-not-allowed opacity-60';
  } else if (selected) {
    classes += ' bg-blue-500 scale-110 shadow-lg';
  } else {
    classes += ` ${tierBg[seat.tier]} hover:scale-105`;
  }

  const ariaLabel = `Seat ${seat.id}, ${seat.tier}, ₹${seat.price}, ${
    seat.status === 'booked' ? 'booked' : selected ? 'selected' : 'available'
  }`;

  return (
    <button
      role='gridcell'
      aria-label={ariaLabel}
      aria-pressed={selected}
      title={`${seat.id} — ${seat.tier} — ₹${seat.price}`}
      disabled={disabled}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle(seat.id);
        }
      }}
      onClick={() => !disabled && onToggle(seat.id)}
      className={classes}
    >
    </button>
  );
}
