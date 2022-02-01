import * as React from 'react';
import {render, RenderOptions, screen} from '@testing-library/react';
import {ThemeProvider} from '../../components/theme';
import EasyButton from '../../components/easy-button';

// Extending a type via intersections
type renderWithProvidersProps = RenderOptions & {
  theme?: string;
};

// ...options: This object not only supports the theme that I have for my particular use case
// but also anything else that the render function from React Testing Library gives me.
// Example: That would allow me to configure other things like if I wanted to test the hydration
// functionality or whatever else I want to do.
// renderWithTheme(<EasyButton>Easy</EasyButton>, {theme: 'light', hydrate: true });
function renderWithTheme(
  ui: React.ReactElement,
  {theme, ...options}: renderWithProvidersProps = {},
) {
  function Wrapper({children}: {children: React.ReactNode}) {
    if (theme !== 'light' && theme !== 'dark') {
      throw new Error('Invalid theme');
    }
    return <ThemeProvider initialTheme={theme}>{children}</ThemeProvider>;
  }

  return render(ui, {wrapper: Wrapper, ...options});
}

test('renders with the light styles for the light theme', () => {
  renderWithTheme(<EasyButton>Easy</EasyButton>, {theme: 'light'});
  const button = screen.getByRole('button', {name: /easy/i});
  expect(button).toHaveStyle(`
     background-color: white;
     color: black;
   `);
});

test('renders with the dark styles for the dark theme', () => {
  renderWithTheme(<EasyButton>Easy</EasyButton>, {theme: 'dark'});
  const button = screen.getByRole('button', {name: /easy/i});
  expect(button).toHaveStyle(`
     background-color: black;
     color: white;
   `);
});
