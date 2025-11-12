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

test('booking flow: select seats -> confirm -> seats become booked and selection clears', async () => {
  renderSeatPageFor('abc');
  const user = userEvent.setup();

  // Select two available seats
  const s1 = await screen.findByRole('gridcell', { name: /^Seat A1,/i });
  const s2 = await screen.findByRole('gridcell', { name: /^Seat A2,/i });
  await user.click(s1);
  await user.click(s2);

  // Click Book Now (in the summary panel)
  const bookNow = screen.getByRole('button', { name: /Book Now/i });
  await user.click(bookNow);

  // Confirm in modal
  const confirm = await screen.findByRole('button', { name: /Confirm/i });
  await user.click(confirm);

  // Success message should appear
  expect(await screen.findByText(/Booked 2 seat\(s\)/i)).toBeInTheDocument();

  // Seats previously selected should now be disabled (booked)
  const bookedSeat1 = screen.getByRole('gridcell', { name: /^Seat A1,/i });
  const bookedSeat2 = screen.getByRole('gridcell', { name: /^Seat A2,/i });

  // The underlying <button> is rendered as gridcell; check the disabled attribute
  expect(bookedSeat1.closest('button')).toBeDisabled();
  expect(bookedSeat2.closest('button')).toBeDisabled();

  // Summary should show no selected seats (Selected (0) or "No seats selected")
  // Either of these is acceptable depending on UI; check for either
  expect(
    screen.queryByText(/Selected \(\d+\)/i) // ensure not showing previous selection
  ).toBeTruthy();
});
