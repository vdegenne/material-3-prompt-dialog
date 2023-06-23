import {html} from 'lit-html';
import {prompt} from '../src/index.js';

let i = 0;

try {
  const returnedValue = await prompt({
    // transition: '',
    headline: 'Are you sure?',
    content: html`are you sure you want to delete this item?
      <b id="bold">test</b>`,
    escapeKeyAction: '',
    onDialogReady(dialog) {
      dialog.$.bold.setAttribute('style', 'background-color:green');
    },
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
