import {type TemplateResult} from 'lit-html';
import {materialDialog, type PromptButton} from './dialog.js';

interface MaterialConfirmOptions {
	headline?: string;
	content?: string | TemplateResult;
	confirmButton?: PromptButton;
	cancelButton?: PromptButton;
}

export async function materialConfirm({
	headline = 'Are you sure?',
	content = 'Are you sure to perform this action?',
	cancelButton = {},
	confirmButton = {},
}: MaterialConfirmOptions = {}) {
	return await materialDialog({
		headline,

		content() {
			return content;
		},

		confirmButton,

		cancelButton,
	});
}
