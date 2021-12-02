import {rest} from 'msw';

const delay = process.env.NODE_ENV === 'test' ? 0 : 1500;

export type LoginResponse = {username: string} | {message: string};

const handlers = [
  rest.post<Record<string, string>, LoginResponse>(
    'https://auth-provider.example.com/api/login',
    async (req, res, ctx) => {
      if (!req.body.password) {
        return res(
          ctx.delay(delay),
          ctx.status(400),
          ctx.json({message: 'password required'}),
        );
      }
      if (!req.body.username) {
        return res(
          ctx.delay(delay),
          ctx.status(400),
          ctx.json({message: 'username required'}),
        );
      }
      return res(ctx.delay(delay), ctx.json({username: req.body.username}));
    },
  ),
];

export {handlers};
