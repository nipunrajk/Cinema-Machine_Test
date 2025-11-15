import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Seat } from '../types';
import { theatres } from '../data/theatres';
import { generateSeats } from '../utils/seatGenerator';
import {
  getSupabaseMovieId,
  getSupabaseTheatreId,
} from '../data/supabaseMapping';

type SeatStore = {
  // data
  selectedMovieId: string | null;
  selectedTheatreId: string | null;
  seats: Seat[]; // current seats for selectedTheatreId
  selectedIds: string[]; // selected seat ids (order preserved)
  error: string | null;
  successMessage: string | null;
  timerStartTime: number | null; // timestamp when timer started
  timerExpired: boolean; // flag to show expiry modal

  // actions
  setMovie: (movieId: string | null) => void;
  setTheatre: (theatreId: string | null) => void;
  toggleSeat: (seatId: string) => void;
  clearSelection: () => void;
  bookSelected: () => void;
  setError: (msg: string | null) => void;
  startTimer: () => void;
  stopTimer: () => void;
  expireTimer: () => void;
  acknowledgeExpiry: () => void;
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
      timerStartTime: null,
      timerExpired: false,

      setMovie: (movieId) => set(() => ({ selectedMovieId: movieId })),

      setTheatre: async (theatreId) => {
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
        let seats = theatre ? generateSeats(theatre) : [];

        // Load booked seats from Supabase
        try {
          const { supabase } = await import('../lib/supabase');
          const { areMappingsInitialized, initializeIdMappings } = await import(
            '../data/supabaseMapping'
          );

          // Ensure mappings are initialized
          if (!areMappingsInitialized()) {
            await initializeIdMappings();
          }

          // Convert local IDs to Supabase UUIDs
          const { selectedMovieId } = get();
          const supabaseTheatreId = getSupabaseTheatreId(theatreId);
          const supabaseMovieId = getSupabaseMovieId(selectedMovieId);

          const { data: bookings, error } = await supabase
            .from('bookings')
            .select('seat_ids')
            .eq('theatre_id', supabaseTheatreId)
            .eq('movie_id', supabaseMovieId)
            .eq('status', 'confirmed');

          if (!error && bookings) {
            // Get all booked seat IDs
            const bookedSeatIds = new Set(bookings.flatMap((b) => b.seat_ids));

            // Mark seats as booked
            seats = seats.map((seat) => ({
              ...seat,
              status: bookedSeatIds.has(seat.id)
                ? ('booked' as const)
                : seat.status,
            }));
          }
        } catch (err) {
          console.error('Failed to load booked seats:', err);
          // Continue with local seats if Supabase fails
        }

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
        const { seats, selectedIds, timerStartTime } = get();
        const seat = seats.find((s) => s.id === seatId);
        if (!seat || seat.status === 'booked') return;

        const already = selectedIds.includes(seatId);
        if (already) {
          const newSelectedIds = selectedIds.filter((id) => id !== seatId);
          set(() => ({
            selectedIds: newSelectedIds,
          }));
          // Stop timer if no seats selected
          if (newSelectedIds.length === 0) {
            set(() => ({ timerStartTime: null }));
          }
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

        // Start timer on first seat selection
        if (!timerStartTime && selectedIds.length === 0) {
          set(() => ({ timerStartTime: Date.now() }));
        }
      },

      clearSelection: () =>
        set(() => ({ selectedIds: [], error: null, timerStartTime: null })),

      bookSelected: async () => {
        const { selectedIds, seats, selectedMovieId, selectedTheatreId } =
          get();
        if (selectedIds.length === 0) return;

        try {
          // Import supabase and auth dynamically
          const { supabase } = await import('../lib/supabase');
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) {
            set(() => ({ error: 'Please login to book seats' }));
            return;
          }

          // Calculate total amount
          const selectedSeats = seats.filter((s) => selectedIds.includes(s.id));
          const totalAmount = selectedSeats.reduce(
            (sum, seat) => sum + seat.price,
            0
          );

          // Generate booking code
          const bookingCode = `BK${Date.now()}${Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase()}`;

          // Convert local IDs to Supabase UUIDs
          const supabaseMovieId = getSupabaseMovieId(selectedMovieId);
          const supabaseTheatreId = getSupabaseTheatreId(selectedTheatreId);

          // Save to Supabase
          const { error: bookingError } = await supabase
            .from('bookings')
            .insert({
              user_id: user.id,
              movie_id: supabaseMovieId,
              theatre_id: supabaseTheatreId,
              seat_ids: selectedIds,
              total_amount: totalAmount,
              booking_code: bookingCode,
              status: 'confirmed',
            })
            .select()
            .single();

          if (bookingError) {
            console.error('Booking error:', bookingError);
            set(() => ({
              error: 'Failed to save booking. Please try again.',
            }));
            return;
          }

          // Mark seats as booked locally
          const next: Seat[] = seats.map((s) =>
            selectedIds.includes(s.id) ? { ...s, status: 'booked' as const } : s
          );

          set(() => ({
            seats: next,
            selectedIds: [],
            successMessage: `Booking confirmed! Code: ${bookingCode}`,
            error: null,
            timerStartTime: null,
          }));

          // clear success after a short timeout
          window.setTimeout(() => set(() => ({ successMessage: null })), 4000);
        } catch (err) {
          console.error('Booking failed:', err);
          set(() => ({
            error: 'Failed to complete booking. Please try again.',
          }));
        }
      },

      startTimer: () => set(() => ({ timerStartTime: Date.now() })),

      stopTimer: () => set(() => ({ timerStartTime: null })),

      expireTimer: () =>
        set(() => ({
          selectedIds: [],
          timerStartTime: null,
          timerExpired: true,
          error: null,
        })),

      acknowledgeExpiry: () => set(() => ({ timerExpired: false })),

      setError: (msg) => set(() => ({ error: msg })),

      reset: () =>
        set(() => ({
          selectedMovieId: null,
          selectedTheatreId: null,
          seats: [],
          selectedIds: [],
          error: null,
          successMessage: null,
          timerStartTime: null,
          timerExpired: false,
        })),
    }),
    {
      name: 'seat-store-v1',
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    }
  )
);
