import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Seat } from '../types';
import { theatres } from '../data/theatres';
import { generateSeats } from '../utils/seatGenerator';

type SeatStore = {
  // data
  selectedMovieId: string | null;
  selectedTheatreId: string | null;
  seats: Seat[]; // current seats for selectedTheatreId
  selectedIds: string[]; // selected seat ids (order preserved)
  error: string | null;
  successMessage: string | null;

  // actions
  setMovie: (movieId: string | null) => void;
  setTheatre: (theatreId: string | null) => void;
  toggleSeat: (seatId: string) => void;
  clearSelection: () => void;
  bookSelected: () => void;
  setError: (msg: string | null) => void;
  reset: () => void;
};

const MAX_SELECTION = 8;

export const useSeatStore = create<SeatStore>()(
  persist(
    (set, get) => ({
      selectedMovieId: null,
      selectedTheatreId: null,
      seats: [],
      selectedIds: [],
      error: null,
      successMessage: null,

      setMovie: (movieId) => set(() => ({ selectedMovieId: movieId })),

      setTheatre: (theatreId) => {
        if (!theatreId) {
          set(() => ({
            selectedTheatreId: null,
            seats: [],
            selectedIds: [],
            error: null,
          }));
          return;
        }

        const { selectedTheatreId: currentTheatreId } = get();
        const theatre = theatres.find((t) => t.id === theatreId);
        const seats = theatre ? generateSeats(theatre) : [];

        // Only clear selectedIds if we're switching to a different theatre
        const shouldClearSelection = currentTheatreId !== theatreId;

        set((state) => ({
          selectedTheatreId: theatreId,
          seats,
          selectedIds: shouldClearSelection ? [] : state.selectedIds,
          error: null,
          successMessage: null,
        }));
      },

      toggleSeat: (seatId) => {
        const { seats, selectedIds } = get();
        const seat = seats.find((s) => s.id === seatId);
        if (!seat || seat.status === 'booked') return;

        const already = selectedIds.includes(seatId);
        if (already) {
          set((state) => ({
            selectedIds: state.selectedIds.filter((id) => id !== seatId),
          }));
          return;
        }

        if (selectedIds.length >= MAX_SELECTION) {
          set(() => ({
            error: `You can only select up to ${MAX_SELECTION} seats.`,
          }));
          // clear after short delay
          window.setTimeout(() => set(() => ({ error: null })), 2500);
          return;
        }

        set((state) => ({ selectedIds: [...state.selectedIds, seatId] }));
      },

      clearSelection: () => set(() => ({ selectedIds: [], error: null })),

      bookSelected: () => {
        const { selectedIds, seats } = get();
        if (selectedIds.length === 0) return;

        // mark seats as booked
        const next: Seat[] = seats.map((s) =>
          selectedIds.includes(s.id) ? { ...s, status: 'booked' as const } : s
        );
        const msg = `Booked ${selectedIds.length} seat(s): ${selectedIds.join(
          ', '
        )}`;
        set(() => ({
          seats: next,
          selectedIds: [],
          successMessage: msg,
          error: null,
        }));

        // clear success after a short timeout
        window.setTimeout(() => set(() => ({ successMessage: null })), 4000);
      },

      setError: (msg) => set(() => ({ error: msg })),

      reset: () =>
        set(() => ({
          selectedMovieId: null,
          selectedTheatreId: null,
          seats: [],
          selectedIds: [],
          error: null,
          successMessage: null,
        })),
    }),
    {
      name: 'seat-store-v1',
      partialize: (state) => ({
        selectedMovieId: state.selectedMovieId,
        selectedTheatreId: state.selectedTheatreId,
        selectedIds: state.selectedIds,
      }),
    }
  )
);
