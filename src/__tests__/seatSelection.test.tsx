import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SeatSelectionPage from '../pages/SeatSelectionPage';
import { useSeatStore } from '../store/useSeatStore';
import '@testing-library/jest-dom';
import { Toaster } from 'react-hot-toast';

beforeEach(() => {
  // Reset store before each test to avoid state leakage
  useSeatStore.getState().reset();
  // Clear localStorage to reset persisted state
  localStorage.clear();
});

function renderSeatPageFor(theatreId = 'abc') {
  const entry = `/movies/m-test/theatres/${theatreId}`;
  render(
    <>
      <Toaster position='top-right' />
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

test('selecting a seat shows it in the selection summary and updates total', async () => {
  renderSeatPageFor('abc');
  const user = userEvent.setup();

  // find seat A1 and click it
  const seatA1 = await screen.findByRole('gridcell', { name: /^Seat A1,/i });
  await user.click(seatA1);

  // the booking summary heading is present
  const summaryHeading = screen.getByRole('heading', {
    name: /Booking Summary/i,
  });
  expect(summaryHeading).toBeInTheDocument();

  // scope queries to the summary panel (its parent contains list and total)
  const summaryPanel = summaryHeading.closest('div')!;
  const withinSummary = within(summaryPanel);

  // expect seat id in the summary area
  expect(withinSummary.getByText(/A1 · Silver/)).toBeInTheDocument();

  // find the Total within the summary area and assert its parent contains the price
  const totalLabel = withinSummary.getByText('Total');
  expect(totalLabel.parentElement).toHaveTextContent('₹100');
});

test('selecting more than 8 seats shows max-8 error and blocks 9th', async () => {
  renderSeatPageFor('abc');
  const user = userEvent.setup();

  // pick 9 available seats: adjust if your seed has some booked
  const seats = ['A1', 'A2', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'B1'];

  // click first 8
  for (let i = 0; i < 8; i++) {
    const el = await screen.findByRole('gridcell', {
      name: new RegExp(`^Seat ${seats[i]},`),
    });
    await user.click(el);
  }

  // Check that 8 seats are selected by counting selected seats in the summary
  const summaryHeading = screen.getByRole('heading', {
    name: /Booking Summary/i,
  });
  const summaryPanel = summaryHeading.closest('div')!;
  const withinSummary = within(summaryPanel);

  // Should have 8 seat entries in the summary
  const seatEntries = withinSummary.getAllByText(/[A-Z]\d+ · /);
  expect(seatEntries).toHaveLength(8);

  // attempt 9th
  const ninth = await screen.findByRole('gridcell', {
    name: new RegExp(`^Seat ${seats[8]},`),
  });
  await user.click(ninth);

  // error shown and selection still 8
  expect(
    screen.getByText(/You can only select up to 8 seats/i)
  ).toBeInTheDocument();

  // Should still have 8 seat entries in the summary
  const summaryHeading2 = screen.getByRole('heading', {
    name: /Booking Summary/i,
  });
  const summaryPanel2 = summaryHeading2.closest('div')!;
  const withinSummary2 = within(summaryPanel2);
  const seatEntries2 = withinSummary2.getAllByText(/[A-Z]\d+ · /);
  expect(seatEntries2).toHaveLength(8);
});
