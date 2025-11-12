
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SeatSelectionPage from '../pages/SeatSelectionPage';
import { theatres } from '../data/theatres';

/**
 * These tests use the real SeatSelectionPage component and the seed theatres.
 * We navigate to the route that the page expects using MemoryRouter.
 */

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

  // wait for the page to render seat A1
  const seatA1 = await screen.findByText('A1');
  await user.click(seatA1);

  // the selection summary should contain A1 and total must reflect its price (₹100)
  expect(screen.getByText(/Selected \(1\)/i)).toBeInTheDocument();
  // the summary displays the seat id text
  expect(screen.getByText(/A1/)).toBeInTheDocument();
  // total value - look for ₹100 somewhere (there is "₹100" in the summary)
  expect(screen.getByText('₹100')).toBeInTheDocument();
});

test('selecting more than 8 seats shows max-8 error and prevents 9th selection', async () => {
  renderSeatPageFor('abc');
  const user = userEvent.setup();

  // choose 9 different seats programmatically. We pick A1..A9 (they should exist in seed).
  const seatIds = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'];

  // Click first 8 (these will be selected)
  for (let i = 0; i < 8; i++) {
    const el = await screen.findByText(seatIds[i]);
    await user.click(el);
  }

  // Verify 8 selected (summary shows Selected (8))
  expect(screen.getByText(/Selected \(8\)/i)).toBeInTheDocument();

  // Now attempt the 9th
  const ninth = await screen.findByText(seatIds[8]);
  await user.click(ninth);

  // The page should show the max-8 error text
  expect(
    screen.getByText(/You can only select up to 8 seats/i)
  ).toBeInTheDocument();

  // And the 9th seat should NOT appear in the selected list (still 8)
  expect(screen.getByText(/Selected \(8\)/i)).toBeInTheDocument();
});
