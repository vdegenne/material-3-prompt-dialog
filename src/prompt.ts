/**
 * @license
 * Copyright (c) 2023 Valentin Degenne
 * SPDX-License-Identifier: MIT
 */
import {html} from 'lit-html';
import {html as staticHtml, literal, unsafeStatic} from 'lit-html/static.js';
import type {PromptButton} from './dialog.js';
import {materialDialog} from './dialog.js';

interface PromptOptions {
	/**
	 * headline of the dialog.
	 */
	promptText?: string;

	/**
	 * Initial textfield value when the dialog opens.
	 */
	initialValue?: string;

	/**
	 * The type of the textfield.
	 * @default md-filled-text-field
	 */
	textfieldType?: string;

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
	promptText,
	initialValue,
	textfieldType,
	confirmButton,
}: PromptOptions = {}): Promise<string> {
	return await materialDialog({
		header: promptText ?? 'Enter a value',

		content(dialog) {
			const textfieldTag = literal`${unsafeStatic(
				textfieldType ?? 'md-filled-text-field'
			)}`;
			return staticHtml`<${textfieldTag}
				id="textfield"
				dialog-focus
				style="width:100%"
				@keydown=${() => {
					setTimeout(() => {
						dialog.$.confirmButton.disabled =
							(dialog.$.textfield as HTMLInputElement).value === '';
					});
				}}
				@keypress=${(e: KeyboardEvent) => {
					if (e.key === 'Enter') {
						dialog.$.confirmButton.click();
					}
				}}
				value=${initialValue ?? ''}
			></${textfieldTag}>`;
		},

		cancelButton: {},

		confirmButton: {
			buttonType: confirmButton?.buttonType ?? 'md-filled-button',
			label: confirmButton?.label ?? 'Confirm',
			async callback(dialog) {
				if (confirmButton?.callback) {
					const result = await confirmButton.callback(dialog);
					if (result) {
						return result;
					}
				}
				return (dialog.$.textfield as HTMLInputElement).value;
				// return dialog!.querySelector('md-filled-text-field')!.value;
			},
		},

		onDialogReady(dialog) {
			dialog.$.confirmButton.disabled =
				(dialog.$.textfield as HTMLInputElement).value.length === 0;
		},
	});
}
