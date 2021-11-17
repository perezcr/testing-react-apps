// Avoid implementation details
// http://localhost:3000/counter

import {render, screen, fireEvent} from '@testing-library/react';
import Counter from '../../components/counter';

test('counter increments and decrements when the buttons are clicked', () => {
  render(<Counter />);
  const decrement = screen.getByRole('button', {name: /decrement/i});
  const increment = screen.getByRole('button', {name: /increment/i});
  const message = screen.getByText(/current count/i);

  // Notice that React Testing Library queries do null-checks for you automatically, so you can ditch all this null-checking stuff.

  expect(message).toHaveTextContent('Current count: 0');

  fireEvent.click(increment);
  expect(message).toHaveTextContent('Current count: 1');

  fireEvent.click(decrement);
  expect(message).toHaveTextContent('Current count: 0');
});
