import { render, screen } from '@testing-library/react';
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

test('seeded booked seats are disabled and cannot be selected', async () => {
  renderSeatPageFor('abc');
  const user = userEvent.setup();

  // A3 is seeded as booked in your theatre data. Find it and ensure it's disabled.
  const a3 = await screen.findByRole('gridcell', { name: /^Seat A3,/i });
  const button = a3.closest('button');
  expect(button).toBeDisabled();

  // Attempting to click should not add it to the summary
  await user.click(a3);
  // ensure it didn't appear in summary
  expect(screen.queryByText(/A3 · SILVER/)).not.toBeInTheDocument();
});
