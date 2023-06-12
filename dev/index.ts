import {prompt} from '../src/index.js';

try {
  const returnedValue = await prompt({
    transition: 'shrink',
    headline: 'Are you sure?',
    content: 'are you sure you want to delete this item?',
    confirmButton: {
      async callback(dialog) {
        await new Promise((r) => setTimeout(r, 2000));
        // return 'THAT';
      },
    },
  });
  console.log('was confirmed');
  console.log(`returned value: ${returnedValue}`);
  // do something...
} catch (_) {
  console.log('was canceled');
}
