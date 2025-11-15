import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SeatSelectionPage from '../pages/SeatSelectionPage';
import { Toaster } from 'react-hot-toast';
import { useSeatStore } from '../store/useSeatStore';

beforeEach(() => {
  useSeatStore.getState().reset();
  localStorage.clear();
});

function renderSeatPageFor(theatreId = 'abc') {
  const entry = `/movies/m-test/theatres/${theatreId}`;
  render(
    <>
      <Toaster />
      <MemoryRouter initialEntries={[entry]}>
        <Routes>
          <Route
            path='/movies/:movieId/theatres/:theatreId'
            element={<SeatSelectionPage />}
          />
        </Routes>
      </MemoryRouter>
    </>
  );
}

test('booked seats are disabled and cannot be selected', async () => {
  renderSeatPageFor('abc');
  const user = userEvent.setup();

  // Select and book a seat first
  const a3 = await screen.findByRole('gridcell', { name: /^Seat A3,/i });
  await user.click(a3);

  // Book it
  const bookNow = screen.getByRole('button', { name: /Book Now/i });
  await user.click(bookNow);
  const confirm = await screen.findByRole('button', { name: /Confirm/i });
  await user.click(confirm);

  // Wait for success message
  await screen.findByText(/Booking confirmed/i);

  // Now A3 should be disabled
  const bookedSeat = screen.getByRole('gridcell', { name: /^Seat A3,/i });
  const button = bookedSeat.closest('button');
  expect(button).toBeDisabled();

  // Attempting to click should not add it to the summary
  await user.click(bookedSeat);
  expect(screen.queryByText(/A3 · SILVER/)).not.toBeInTheDocument();
});
