// simple test with ReactDOM
// http://localhost:3000/counter

import ReactDOM from 'react-dom';
import Counter from '../../components/counter';

beforeEach(() => {
  // cleanup by removing the div from the page (div.remove())
  // If you don't cleanup, then it could impact other tests and/or cause a memory leak
  document.body.innerHTML = '';
});

test('counter increments and decrements when the buttons are clicked', () => {
  const div = document.createElement('div');
  document.body.append(div);

  ReactDOM.render(<Counter />, div);

  // TypeScript doesn't trust the DOM very much, so you'll need to verify
  // things are what they should be to make TypeScript happy here.
  const [decrement, increment] = Array.from(div.querySelectorAll('button'));
  if (!decrement || !increment) {
    throw new Error('decrement and increment not found');
  }
  if (!(div.firstChild instanceof HTMLElement)) {
    throw new Error('first child is not a div');
  }
  const message = div.firstChild.querySelector('div');
  if (!message) {
    throw new Error(`couldn't find message div`);
  }

  expect(message.textContent).toBe('Current count: 0');

  const incrementClickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    button: 0,
  });
  increment.dispatchEvent(incrementClickEvent);
  expect(message.textContent).toBe('Current count: 1');

  const decrementClickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    button: 0,
  });
  decrement.dispatchEvent(decrementClickEvent);
  expect(message.textContent).toBe('Current count: 0');
});
