import {prompt} from '../src/index.js';

try {
  await prompt({
    transition: 'shrink',
    headline: 'Are you sure?',
    content: 'are you sure you want to delete this item?',
    confirmButton: {
      callback(dialog) {},
    },
  });
  console.log('was confirmed');
  // do something...
} catch (_) {
  console.log('was canceled');
}
