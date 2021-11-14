// simple test with React Testing Library
// http://localhost:3000/counter

import {render, fireEvent} from '@testing-library/react';
import '@testing-library/dom';
import Counter from '../../components/counter';

test('counter increments and decrements when the buttons are clicked', () => {
  // swap ReactDOM.render with React Testing Library's render
  // Note that React Testing Library's render doesn't need you to pass a `div`
  // so you only need to pass one argument. render returns an object with a
  // bunch of utilities on it. For now, let's just grab `container` which is
  // the div that React Testing Library creates for us.
  const {container} = render(<Counter />);

  const [decrement, increment] = Array.from(
    container.querySelectorAll('button'),
  );
  if (!decrement || !increment) {
    throw new Error('decrement and increment not found');
  }
  if (!(container.firstChild instanceof HTMLElement)) {
    throw new Error('first child is not a div');
  }

  const message = container.firstChild.querySelector('div');
  if (!message) {
    throw new Error(`couldn't find message div`);
  }

  expect(message.textContent).toBe('Current count: 0');

  // 🐨 replace the next two statements with `fireEvent.click(button)`
  /* const incrementClickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    button: 0,
  });
  increment.dispatchEvent(incrementClickEvent); */
  fireEvent.click(increment);
  expect(message).toHaveTextContent('Current count: 1');

  /* const decrementClickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    button: 0,
  });
  decrement.dispatchEvent(decrementClickEvent); */
  fireEvent.click(decrement);
  expect(message).toHaveTextContent('Current count: 0');
});
