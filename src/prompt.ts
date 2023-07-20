/**
 * @license
 * Copyright (c) 2023 Valentin Degenne
 * SPDX-License-Identifier: MIT
 */
import {html} from 'lit-html';
import type {PromptButton} from './dialog.js';
import {materialDialog} from './dialog.js';
import type {MdFilledTextField} from '@material/web/textfield/filled-text-field.js';

interface PromptOptions {
	/**
	 * headline of the dialog.
	 */
	promptText: string;

	/**
	 * Options for the confirm button.
	 */
	confirmButton?: PromptButton;
}

/**
 * Prompt the user to enter a value in an input.
 *
 * @returns {string} the content of the input or throw an error if it was canceled.
 */
export async function materialPrompt({
	promptText = 'Enter a name',
	confirmButton = {},
}: PromptOptions): Promise<string> {
	return await materialDialog({
		header: promptText,

		content(dialog) {
			return html`<md-filled-text-field
				id="inputButton"
				dialog-focus
				style="width:100%"
				@keydown=${() => {
					setTimeout(() => {
						dialog.$.confirmButton.disabled =
							(dialog.$.inputButton as HTMLInputElement).value === '';
					});
				}}
				@keypress=${(e: KeyboardEvent) => {
					if (e.key === 'Enter') {
						dialog.$.confirmButton.click();
					}
				}}
			></md-filled-text-field>`;
		},

		cancelButton: {},

		confirmButton: {
			buttonType: confirmButton.buttonType ?? 'md-filled-button',
			label: confirmButton.label ?? 'Confirm',
			async callback(dialog) {
				if (confirmButton.callback) {
					const result = await confirmButton.callback(dialog);
					if (result) {
						return result;
					}
				}
				return dialog!.querySelector('md-filled-text-field')!.value;
			},
		},

		onDialogReady(dialog) {
			(dialog.$.confirmButton as HTMLButtonElement).disabled = true;
		},
	});
}
