# Material 3 Prompt Dialog

Small prompt dialog utility function written in Material-web 3

![screenshot](https://github.com/vdegenne/material-3-prompt-dialog/blob/master/screenshot.png)

## Installation

```bash
npm add -D material-3-prompt-dialog
```

This package doesn't rely on a specific version of `md-dialog` to avoid conflict within your project, so you will also need to install `@material/web` if not already there, and importing the elements you'd like to use

```bash
npm add -D @material/web
```

```typescript
import '@material/web/dialog/dialog.js'; // required
import '@material/web/button/text-button.js'; // default button
// import any other buttons you'd like to use.
```

## Usage

```typescript
import {prompt} from 'material-3-prompt-dialog';

try {
  await prompt({
    headline: 'Are you sure?',
    content: 'are you sure you want to delete this item?',
    confirmButton: {
      /* confirm button options */
    },
  });
  // dialog was confirmed, do something...
} catch (_) {
  // dialog was canceled
}
```

### PromptOptions

```typescript
{
  /**
   * Headline of the dialog.
   */
  headline?: string | TemplateResult,
  /**
   * Content of the dialog.
   */
  content: string | TemplateResult,
  /**
   * Confirm button options.
   */
  confirmButton?: PromptButton,
  /**
   * Cancel button options.
   */
  cancelButton?: PromptButton,
  /**
   * Transition of the dialog.
   */
  transition?: 'grow'|'shrink'|'grow-down'|'grow-up'|'grow-left'|'grow-right';
}
```

### PromptButton (options)

```typescript
{
  /**
   * The label of the button.
   */
  label?: string | TemplateResult,
  /**
   * The dialog action that the button emits when clicked.
   */
  dialogAction?: string,
  /**
   * Option callback to execute when the button is clicked.
   * @param {MdDialog} dialog dialog host
   * @returns void
   */
  callback?: (dialog?: MdDialog) => void,
  /**
   * The default tagname to be used for the button.
   * @default 'md-text-button'
   */
  buttonType?: string,
}
```

## License

MIT (c) 2023 Valentin Degenne
