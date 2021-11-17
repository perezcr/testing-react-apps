// Avoid implementation details
// http://localhost:3000/counter

import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from '../../components/counter';

test('counter increments and decrements when the buttons are clicked', () => {
  render(<Counter />);
  const decrement = screen.getByRole('button', {name: /decrement/i});
  const increment = screen.getByRole('button', {name: /increment/i});
  const message = screen.getByText(/current count/i);

  // Notice that React Testing Library queries do null-checks for you automatically, so you can ditch all this null-checking stuff.

  expect(message).toHaveTextContent('Current count: 0');

  // When the user clicks on things, they are firing all kinds of events like pointer events, mouse events. If they're using keyboard,
  // then they're going to be doing key events. It would be great if instead of just firing the click event, we've fired all of those events
  // to ensure that our test is resembling the way that our software is going to be used in production as closely as possible.

  // The only difference between fireEvent and userEvent is that userEvent is going to fire a bunch of different events that are associated
  // with this typical user interaction of a click. UserEvent does fire a mouseDown and a mouseUp, as well as several other events that are
  // typically fired when a user clicks on a particular area of the UI.

  // UserEvent is built on top of testing-library's fireEvent to fire all of those events.
  // UserEvent has a bunch of methods on it that you can use to trigger typical interactions that
  // your users will perform with your application. In general, you want to defer to userEvent if you can,
  // before you reach for fireEvent. That way you can keep your test free of implementation details.
  userEvent.click(increment);
  expect(message).toHaveTextContent('Current count: 1');

  userEvent.click(decrement);
  expect(message).toHaveTextContent('Current count: 0');
});
