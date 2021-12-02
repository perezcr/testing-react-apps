// mocking HTTP requests
// http://localhost:3000/login-submission

import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {build, fake} from '@jackfranklin/test-data-bot';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {handlers, LoginResponse} from 'test/server-handlers';
import Login from '../../components/login-submission';
import type {LoginFormValues} from '../../components/login';

const buildLoginForm = build<LoginFormValues>({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
});

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterAll(() => server.close());
// We'll say after each one of these, we're going to clean up all of the runtime handlers. Just remove them all and go back to what we had when we first set up this server.
afterEach(() => server.resetHandlers());

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

test(`unknown server error displays the error message`, async () => {
  const testErrorMessage = 'Something is wrong';
  // Keep in mind here is we've added a server handler for this request, effectively overriding the existing request.
  // Things are working OK right here because this is the last test in our file, but if I move this up to the very
  // top and make it the first test in our file, then sure this test will pass just fine, but my other tests are
  // totally going to fail.

  // The reason that they fail is because every time we make this POST request, we're going to respond with a 500. We need to clear this out somehow.
  // One way we can do that is say server reset handlers.
  server.use(
    rest.post<Record<string, string>, LoginResponse>(
      'https://auth-provider.example.com/api/login',
      async (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({message: testErrorMessage}));
      },
    ),
  );
  render(<Login />);
  userEvent.click(screen.getByRole('button', {name: /submit/i}));

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i));

  expect(screen.getByRole('alert')).toHaveTextContent(testErrorMessage);
});
