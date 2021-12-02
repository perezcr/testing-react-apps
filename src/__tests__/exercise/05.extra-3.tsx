// mocking HTTP requests
// http://localhost:3000/login-submission

import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {build, fake} from '@jackfranklin/test-data-bot';
import {setupServer} from 'msw/node';
import {handlers} from 'test/server-handlers';
import Login from '../../components/login-submission';
import {LoginFormValues} from '../../components/login';

const buildLoginForm = build<LoginFormValues>({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
});

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterAll(() => server.close());

test(`logging in displays the user's username`, async () => {
  render(<Login />);
  const {username, password} = buildLoginForm();

  userEvent.type(screen.getByLabelText(/username/i), username);
  userEvent.type(screen.getByLabelText(/password/i), password);
  userEvent.click(screen.getByRole('button', {name: /submit/i}));

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i));

  expect(screen.getByText(username)).toBeInTheDocument();
});

test(`omitting the password results in an error`, async () => {
  render(<Login />);
  const {username} = buildLoginForm();

  userEvent.type(screen.getByLabelText(/username/i), username);
  userEvent.click(screen.getByRole('button', {name: /submit/i}));

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i));

  // toMatchInlineSnapshot just is serializing, this div that I'm passing here as a string and updating my code for me automatically.
  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"password required"`,
  );
  // Update Snapshots
  // All I have to do is press U to get that updated. My test is going to pass,
  // and my test code is going to be updated automatically. This is one feature that I use for error
  // messages all the time. I think it's super, super helpful as an assertion for this kind of scenario.
});
