// testing custom hooks
// http://localhost:3000/counter-hook

import {render, act} from '@testing-library/react';
import useCounter, {useCounterProps} from '../../components/use-counter';

function setup(initialProps: useCounterProps = {}) {
  let result: {current: ReturnType<typeof useCounter> | null} = {current: null};
  function TestComponent(props: useCounterProps) {
    result.current = useCounter(props);
    return null;
  }
  render(<TestComponent {...initialProps} />);
  // Problem
  // result: ReturnType<typeof useCounter> ->
  // We reassign the result to a new object. Just because we're reassigning this variable doesn't mean that we're reassigning this variable.
  // Solution
  // result: {current: ReturnType<typeof useCounter> | null} = {current: null};
  // Now, we have a reference to the exact same object, which gets reassigned to whatever use counter returns.
  return result;
}

test('exposes the count and increment/decrement functions', () => {
  const result = setup();
  expect(result.current.count).toBe(0);
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);
  act(() => result.current.decrement());
  expect(result.current.count).toBe(0);
});

test('allows customization of the initial count', () => {
  const result = setup({initialCount: 2});
  expect(result.current.count).toBe(2);
  act(() => result.current.increment());
  expect(result.current.count).toBe(3);
  act(() => result.current.decrement());
  expect(result.current.count).toBe(2);
});

test('allows customization of the initial step', () => {
  const result = setup({step: 3});
  expect(result.current.count).toBe(0);
  act(() => result.current.increment());
  expect(result.current.count).toBe(3);
  act(() => result.current.decrement());
  expect(result.current.count).toBe(0);
});
