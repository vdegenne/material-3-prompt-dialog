import {prompt} from '../src/index.js';

let i = 0;

try {
  const returnedValue = await prompt({
    transition: 'shrink',
    headline: 'Are you sure?',
    content: 'are you sure you want to delete this item?',
    confirmButton: {
      dialogAction: '',
      async callback(dialog) {
        console.log('hi');
        await new Promise((r) => setTimeout(r, 5000));
        console.log('boom');
        if (++i == 5) {
          dialog?.close();
        }
        // return 'hum'
        //   await new Promise((r) => setTimeout(r, 2000));
        // return 'THAT';
      },
    },
    cancelButton: {},
  });
  console.log('was confirmed');
  console.log(`returned value: ${returnedValue}`);
  // do something...
} catch (_) {
  console.log('was canceled');
}
