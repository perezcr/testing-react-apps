// Module that mports render from React Testing Library render.
// It creates its own render function and then it re-exports everything from React Testing Library.
// It can be your own version of React Testing Library.
import {render as rtlRender, RenderOptions} from '@testing-library/react';
import {ThemeProvider} from 'components/theme';

// Extending a type via intersections
type renderWithProvidersProps = RenderOptions & {
  theme?: string;
};

// ...options: This object not only supports the theme that I have for my particular use case
// but also anything else that the render function from React Testing Library gives me.
// Example: That would allow me to configure other things like if I wanted to test the hydration
// functionality or whatever else I want to do.
// renderWithTheme(<EasyButton>Easy</EasyButton>, {theme: 'light', hydrate: true });
function render(
  ui: React.ReactElement,
  {theme, ...options}: renderWithProvidersProps = {},
) {
  function Wrapper({children}: {children: React.ReactNode}) {
    if (theme !== 'light' && theme !== 'dark') {
      throw new Error('Invalid theme');
    }
    return <ThemeProvider initialTheme={theme}>{children}</ThemeProvider>;
  }

  return rtlRender(ui, {wrapper: Wrapper, ...options});
}

export * from '@testing-library/react';
// override React Testing Library's render with our own
// They should all be using this render method because those providers are an implementation detail of each one of your components.
// They should just have all of the same providers that they're going to have when you ship the actual app.
export {render};
