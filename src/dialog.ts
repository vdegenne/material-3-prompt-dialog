/**
 * @license
 * Copyright (c) 2023 Valentin Degenne
 * SPDX-License-Identifier: MIT
 */
import {render, TemplateResult, html, nothing} from 'lit-html';
import {html as staticHtml, literal, unsafeStatic} from 'lit-html/static.js';
import {createRef, ref} from 'lit-html/directives/ref.js';
import {MdDialog} from '@material/web/dialog/dialog.js';
import '@material/web/dialog/dialog.js';
import '@material/web/button/text-button.js';
import {StyleInfo, styleMap} from 'lit-html/directives/style-map.js';

type AugmentedMdDialog = MdDialog & {
	$: {
		[elementId: string]: Element;
		confirmButton: HTMLButtonElement;
		cancelButton: HTMLButtonElement;
	};
};

export interface PromptOptions {
	/**
	 * Header of the dialog.
	 */
	header?: string | TemplateResult;
	/**
	 * Content of the dialog.
	 */
	content: (dialog: AugmentedMdDialog) => string | TemplateResult;
	/**
	 * Confirm button options.
	 */
	confirmButton?: PromptButton;
	/**
	 * Cancel button options.
	 */
	cancelButton?: PromptButton;
	/**
	 * Transition of the dialog.
	 *
	 * @type {import('@material/web/dialog/dialog.js').MdDialog['transition']}
	 * @default 'grow-down'
	 */
	transition?: MdDialog['transition'];

	/**
	 * Callback when the dialog content is ready (before it opens).
	 *
	 * @param dialog the prompt dialog
	 */
	onDialogReady?: (dialog: AugmentedMdDialog) => void;

	/**
	 * The action to emit when the scrim is clicked.
	 *
	 * @default "cancel"
	 */
	scrimClickAction?: string;

	/**
	 * The action to emit when escape key is pressed.
	 *
	 * @default "cancel"
	 */
	escapeKeyAction?: string;
}

export interface PromptButton {
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
	 * @param {AugmentedMdDialog} dialog dialog host
	 * @returns void
	 */
	callback?: (dialog: AugmentedMdDialog) => any | Promise<any>;
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

export function materialDialog({
	header,
	content,
	cancelButton,
	confirmButton,
	transition,
	scrimClickAction = 'cancel',
	escapeKeyAction = 'cancel',
	onDialogReady,
}: PromptOptions): Promise<any> {
	return new Promise(async (resolve, reject) => {
		// const dialogref = createRef<AugmentedMdDialog>();
		const container = document.createElement('div');

		let cancelCallbackPromise: Promise<any> = Promise.resolve();
		let confirmCallbackPromise: Promise<any> = Promise.resolve();

		render(
			html`
				<md-dialog
					scrim-click-action="${scrimClickAction}"
					escape-key-action="${escapeKeyAction}"
					transition=${transition ?? 'grow-down'}
					@closed=${async (e) => {
						switch (e.detail.action) {
							case 'cancel':
								// TODO: reactivate following if need the action somehow
								// reject(callbackResult ?? e.detail.action);
								reject(await cancelCallbackPromise);
								break;
							case 'confirm':
							default:
								// TODO: reactivate following if need the action somehow
								// resolve(callbackResult ?? e.detail.action);
								resolve(await confirmCallbackPromise);
						}
						(e.target as Element).remove();
						container.remove();
					}}
				>
				</md-dialog>
			`,
			container
		);

		document.body.prepend(container);

		// const dialog = dialogref.value;
		const dialog = container.querySelector(
			':scope > md-dialog'
		) as AugmentedMdDialog;
		await dialog.updateComplete;

		render(
			html`
				<div slot="header">${header}</div>
				${content(dialog)}
				${cancelButton
					? (() => {
							cancelButton.buttonType =
								cancelButton.buttonType ?? 'md-text-button';
							const button = literal`${unsafeStatic(cancelButton.buttonType)}`;
							return staticHtml`
									<${button}
										id="cancelButton"
										slot="footer"
										style=${styleMap(cancelButton.styles ?? {})}
										@click=${() => {
											if (cancelButton.callback) {
												cancelCallbackPromise = new Promise(async (resolve) => {
													resolve(await cancelButton.callback(dialog));
												});
											}
										}}
										dialog-action="${cancelButton.dialogAction ?? 'cancel'}"
										>${cancelButton.label ?? 'Cancel'}</${button}
									>
								`;
					  })()
					: nothing}
				${confirmButton
					? (() => {
							confirmButton.buttonType =
								confirmButton.buttonType ?? 'md-text-button';
							const button = literal`${unsafeStatic(confirmButton.buttonType)}`;
							return staticHtml`
									<${button}
										id="confirmButton"
										slot="footer"
										style=${styleMap(confirmButton.styles ?? {})}
										@click=${() => {
											if (confirmButton.callback) {
												confirmCallbackPromise = new Promise(
													async (resolve) => {
														resolve(await confirmButton.callback(dialog));
													}
												);
											}
										}}
										dialog-action="${confirmButton.dialogAction ?? 'confirm'}"
										>${confirmButton.label ?? 'Confirm'}</${button}
									>
								`;
					  })()
					: nothing}
			`,
			dialog
		);

		dialog.$ = {
			confirmButton: null,
			cancelButton: null,
		};
		dialog.querySelectorAll('[id]').forEach((el) => {
			dialog.$[el.getAttribute('id')] = el;
		});

		await dialog.updateComplete;

		onDialogReady?.(dialog);
		dialog.show();
	});
}
