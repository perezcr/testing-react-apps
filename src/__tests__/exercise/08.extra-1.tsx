// testing custom hooks
// http://localhost:3000/counter-hook

import {render, act} from '@testing-library/react';
import useCounter from '../../components/use-counter';

// This can be useful if it's difficult to create a component that resembles the way that people typically use your hook, especially for covering different edge cases.
// We don't need user events anymore because we're not interacting with the DOM.
test('exposes the count and increment/decrement functions', () => {
  let result: ReturnType<typeof useCounter>;
  function TestComponent() {
    result = useCounter();
    return null;
  }
  // We need to call hook inside func component because "Hooks can only be called inside of the body of a function component."
  render(<TestComponent />);
  console.log(result); // { count: 0, increment: [Function], decrement: [Function] }
  expect(result.count).toBe(0);
  // Warning: An update to TestComponent inside a test was not wrapped in act(...).
  // When testing, code that causes React state updates should be wrapped into act(...):
  // result.increment();

  // The act function basically just telling React:
  // "I'm going to do something that's going to trigger an update.
  // After my callback is all finished, I want you to flush all the side effects,
  // the React useEffect callbacks and everything so that my next line of code has a stable component
  // to interact with so we don't end up with some sort of intermediary state where our effects haven't been run yet."

  act(() => result.increment());
  expect(result.count).toBe(1);
  act(() => result.decrement());
  expect(result.count).toBe(0);

  // This was not necessary before because we were using userEvent, which wraps everything in act calls.
  // It is now necessary because we are calling that setCount directly through this increment function call.
  // Because of that, we have to manually wrap this in act.
  // This is one of the very few situations where you do have to use the act utility from ReactTestUtils
});
