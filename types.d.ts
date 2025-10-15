import {type MdDialog} from '@material/web/dialog/dialog.js';
import {type TemplateResult} from 'lit-html';
import {type StyleInfo} from 'lit-html/directives/style-map.js';

declare global {
	interface PromptButton {
		/**
		 * The label of the button.
		 */
		label?: string | TemplateResult;
		/**
		 * Additional styles for the button.
		 */
		// styles?: string;
		/**
		 * The dialog action that the button emits when clicked.
		 */
		dialogAction?: string;
		/**
		 * Option callback to execute when the button is clicked.
		 * @param {MdDialog} dialog dialog host
		 * @returns void
		 */
		callback?: (dialog: MdDialog) => any | Promise<any>;
		/**
		 * The default tagname to be used for the button.
		 * @default 'md-text-button'
		 */
		buttonType?: string;

		/**
		 * Set of additional styles for the button
		 */
		styles?: Readonly<StyleInfo>;
	}

	interface DialogOptions {
		/**
		 * Headline of the header of the dialog.
		 *
		 * @default undefined
		 */
		headline: string | TemplateResult | undefined;
		/**
		 * Content of the dialog.
		 */
		content:
			| string
			| TemplateResult
			| ((dialog: MdDialog) => string | TemplateResult);
		/**
		 * Confirm button options.
		 *
		 * @default undefined
		 */
		confirmButton: PromptButton | undefined;
		/**
		 * Cancel button options.
		 *
		 * @default {}
		 */
		cancelButton: PromptButton | undefined;

		/**
		 * Callback when the dialog content is ready (before it opens).
		 *
		 * @param dialog the prompt dialog
		 * @default undefined
		 */
		onDialogReady: ((dialog: MdDialog) => void | Promise<void>) | undefined;

		/**
		 * Whether or not to close the dialog on scrim click.
		 *
		 * @default false
		 */
		blockScrimClick: boolean;

		/**
		 * Whether or not to close the dialog on escape key.
		 *
		 * @default false
		 */
		blockEscapeKey: boolean;

		/**
		 * Additional styles for the dialog (e.g. width control)
		 *
		 * @default undefined
		 */
		styles: StyleInfo | undefined;
	}
}

export {};
