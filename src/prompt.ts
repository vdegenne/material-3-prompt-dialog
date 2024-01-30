/**
 * @license
 * Copyright (c) 2023 Valentin Degenne
 * SPDX-License-Identifier: MIT
 */
import {type TextField} from '@material/web/textfield/internal/text-field.js';
import {type StyleInfo} from 'lit-html/directives/style-map.js';
import {literal, html as staticHtml, unsafeStatic} from 'lit-html/static.js';
// import { ifDefined } from 'lit/directives/if-defined.js';
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
	autocomplete: boolean | string;

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

	/**
	 * A list of forbidden values which will
	 * prevent submit event if the user tries
	 * to use one.
	 *
	 * @default []
	 */
	forbiddenValues: string[];

	/**
	 * Text to display if the input has one of the
	 * forbidden values.
	 *
	 * @default The value already exists.
	 */
	forbiddenText: string;
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
	rows,
	cols,
	dialogStyles,
	forbiddenValues,
	forbiddenText,
}: Partial<PromptOptions> = {}): Promise<string> {
	if (autocomplete !== '' && !autocomplete) {
		autocomplete = 'off';
	}
	if (autocomplete === true) {
		autocomplete = '';
	}
	return await materialDialog({
		headline: promptText ?? 'Enter a value',

		blockEscapeKey,
		blockScrimClick,

		styles: dialogStyles,

		content(dialog) {
			const textfieldTag = textfieldType
				? literal`${unsafeStatic(textfieldType)}`
				: literal`md-filled-text-field`;

			return staticHtml`<${textfieldTag}
				id="textfield"
				style="width:100%"
				autofocus
				autocomplete=${autocomplete}
				type=${type ?? 'input'}
				rows=${rows ?? 3}
				cols=${cols ?? 20}
				@keyup=${() => {
					const textfield = dialog.$.textfield as TextField;
					const value = textfield.value;
					const forbidden = forbiddenValues && forbiddenValues.includes(value);
					dialog.$.confirmButton.disabled = value == '' || forbidden;
					textfield.error = forbidden;
					textfield.errorText = forbidden
						? forbiddenText ?? 'The value already exists'
						: '';
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

		async onDialogReady(dialog) {
			await dialog.updateComplete;
			dialog.$.confirmButton.disabled =
				(dialog.$.textfield as TextField).value.length === 0;
		},
	});
}
