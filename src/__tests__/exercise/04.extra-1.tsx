// form testing

import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../../components/login';

test('submitting the form calls onSubmit with username and password', () => {
  // Jest mock function that will keep track of those things for us
  const handleSubmit = jest.fn();
  render(<Login onSubmit={handleSubmit} />);
  const username = 'chucknorris';
  const password = 'i need no password';

  userEvent.type(screen.getByLabelText(/username/i), username);
  userEvent.type(screen.getByLabelText(/password/i), password);
  userEvent.click(screen.getByRole('button', {name: /submit/i}));

  expect(handleSubmit).toHaveBeenCalledWith({username, password});
  expect(handleSubmit).toHaveBeenCalledTimes(1);
});
