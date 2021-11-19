// form testing

import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {internet} from 'faker';
import Login from '../../components/login';
import type {LoginFormValues} from '../../components/login';

function buildLoginForm(overrides?: Partial<LoginFormValues>) {
  return {
    username: internet.userName(),
    password: internet.password(),
    ...overrides,
  };
}

test('submitting the form calls onSubmit with username and password', () => {
  const handleSubmit = jest.fn();
  render(<Login onSubmit={handleSubmit} />);
  const {username, password} = buildLoginForm({password: 'abc'});

  userEvent.type(screen.getByLabelText(/username/i), username);
  userEvent.type(screen.getByLabelText(/password/i), password);
  userEvent.click(screen.getByRole('button', {name: /submit/i}));

  expect(handleSubmit).toHaveBeenCalledWith({username, password});
  expect(handleSubmit).toHaveBeenCalledTimes(1);
});
