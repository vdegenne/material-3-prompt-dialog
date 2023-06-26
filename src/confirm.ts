import {TemplateResult} from 'lit-html';
import {PromptButton, materialDialog} from './dialog.js';

interface MaterialConfirmOptions {
	header?: string;
	content?: string | TemplateResult;
	confirmButton?: PromptButton;
	cancelButton?: PromptButton;
}

export async function materialConfirm({
	header = 'Are you sure?',
	content = 'Are you sure to perform this action?',
	cancelButton = {},
	confirmButton = {},
}: MaterialConfirmOptions = {}) {
	return await materialDialog({
		headline: header,

		content() {
			return content;
		},

		confirmButton,

		cancelButton,
	});
}
