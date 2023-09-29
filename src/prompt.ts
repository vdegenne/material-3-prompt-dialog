/**
 * @license
 * Copyright (c) 2023 Valentin Degenne
 * SPDX-License-Identifier: MIT
 */
import {ifDefined} from 'lit/directives/if-defined.js';
import {html as staticHtml, literal, unsafeStatic} from 'lit-html/static.js';
import type {PromptButton} from './dialog.js';
import {materialDialog} from './dialog.js';
import { StyleInfo } from 'lit-html/directives/style-map.js';

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

	/**
	 * Whether or not to close the dialog on scrim click.
	 *
	 * @default false
	 */
	blockScrimClick?: boolean;

	/**
	 * Whether or not to close the dialog on escape key.
	 *
	 * @default false
	 */
	blockEscapeKey?: boolean;

	/**
	 * @default 'off'
	 */
	autocomplete: boolean|string;

	/**
	 * Type of the input (e.g. "password", "textarea", "number", ...)
	 * @default "input"
	 */
	type: string;

	/**
	 * Number of rows if input is of type "textarea"
	 */
	rows: number;
	/**
	 * Number of columns if input is of type "textarea"
	 */
	cols: number;


	/**
	 * Additional styles for the dialog
	 */
	dialogStyles: Readonly<StyleInfo>;
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
	blockEscapeKey,
	blockScrimClick,
	autocomplete,
	type,
	rows, cols,
	dialogStyles
}: Partial<PromptOptions> = {}): Promise<string> {
	if (autocomplete !== '' && !autocomplete) {
		autocomplete = 'off';
	}
	if (autocomplete === true) {
		autocomplete = ''
	}
	return await materialDialog({
		headline: promptText ?? 'Enter a value',

		blockEscapeKey,
		blockScrimClick,

		styles: dialogStyles,

		content(dialog) {
			const textfieldTag = literal`${unsafeStatic(
				textfieldType ?? 'md-filled-text-field'
			)}`;
			return staticHtml`<${textfieldTag}
				id="textfield"
				style="width:100%"
				autofocus
				autocomplete=${autocomplete}
				type=${type ?? 'input'}
				rows=${rows ?? 3}
				cols=${cols ?? 20}
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
			},
		},

		onDialogReady(dialog) {
			dialog.$.confirmButton.disabled =
				(dialog.$.textfield as HTMLInputElement).value.length === 0;
		},
	});
}
