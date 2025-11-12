import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SeatSelectionPage from '../pages/SeatSelectionPage';

function renderSeatPageFor(theatreId = 'abc') {
  const entry = `/movies/m-test/theatres/${theatreId}`;
  render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route
          path='/movies/:movieId/theatres/:theatreId'
          element={<SeatSelectionPage />}
        />
      </Routes>
    </MemoryRouter>
  );
}

test('selecting a seat shows it in the selection summary and updates total', async () => {
  renderSeatPageFor('abc');
  const user = userEvent.setup();

  // find seat A1 and click it
  const seatA1 = await screen.findByRole('gridcell', { name: /^Seat A1,/i });
  await user.click(seatA1);

  // the selection summary heading is present
  const summaryHeading = screen.getByRole('heading', {
    name: /Selection Summary/i,
  });
  expect(summaryHeading).toBeInTheDocument();

  // scope queries to the summary panel (its parent contains list and total)
  const summaryPanel = summaryHeading.closest('div')!;
  const withinSummary = within(summaryPanel);

  // expect selected count and seat id in the summary area
  expect(withinSummary.getByText(/Selected \(1\)/i)).toBeInTheDocument();
  expect(withinSummary.getByText(/A1 · SILVER/)).toBeInTheDocument();

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

  expect(screen.getByText(/Selected \(8\)/i)).toBeInTheDocument();

  // attempt 9th
  const ninth = await screen.findByRole('gridcell', {
    name: new RegExp(`^Seat ${seats[8]},`),
  });
  await user.click(ninth);

  // error shown and selection still 8
  expect(
    screen.getByText(/You can only select up to 8 seats/i)
  ).toBeInTheDocument();
  expect(screen.getByText(/Selected \(8\)/i)).toBeInTheDocument();
});
