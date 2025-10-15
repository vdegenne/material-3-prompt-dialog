import {DialogBuilder} from './dialog-builder.js';

export function materialDialog(options?: Partial<DialogOptions>) {
	const dialog = new DialogBuilder(options);
	dialog.show();
}
