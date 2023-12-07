/**
 * @license
 * Copyright (c) 2023 Valentin Degenne
 * SPDX-License-Identifier: MIT
 */
import {render, TemplateResult, html, nothing} from 'lit-html';
import {html as staticHtml, literal, unsafeStatic} from 'lit-html/static.js';
import {type MdDialog} from '@material/web/dialog/dialog.js';
// import '@material/web/dialog/dialog.js';
// import '@material/web/button/text-button.js';
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
	 * Headline of the header of the dialog.
	 */
	headline?: string | TemplateResult;
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
	 * Callback when the dialog content is ready (before it opens).
	 *
	 * @param dialog the prompt dialog
	 */
	onDialogReady?: (dialog: AugmentedMdDialog) => void | Promise<void>;

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
	 * Additional styles for the dialog (e.g. width control)
	 */
	styles: Readonly<StyleInfo>;
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
	headline,
	content,
	cancelButton,
	confirmButton,
	blockScrimClick = false,
	blockEscapeKey = false,
	onDialogReady,
	styles,
}: Partial<PromptOptions>): Promise<any> {
	return new Promise(async (resolve, reject) => {
		// const dialogref = createRef<AugmentedMdDialog>();
		const container = document.createElement('div');

		let cancelCallbackPromise: Promise<any> = Promise.resolve();
		let confirmCallbackPromise: Promise<any> = Promise.resolve();

		let escapePressed = false;

		render(
			html`
				<md-dialog
					?block-scrim-click="${blockScrimClick}"
					?block-escape-key="${blockEscapeKey}"
					style="${styleMap(styles ?? {})}"
					@cancel=${(evt: Event) => {
						const dialog = evt.target as HTMLDialogElement;
						if (dialog.returnValue === '') {
							if (escapePressed) {
								if (dialog.hasAttribute('block-escape-key')) {
									evt.preventDefault();
								}
							} else {
								if (dialog.hasAttribute('block-scrim-click')) {
									evt.preventDefault();
								}
							}
							escapePressed = false;
						}
					}}
					@keydown=${(evt) => {
						if (evt.code === 'Escape') {
							escapePressed = true;
						}
					}}
					@closed=${async (evt: Event) => {
						const target = evt.target as HTMLDialogElement;
						switch (target.returnValue) {
							case '':
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
						(evt.target as Element).remove();
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
				<div slot="headline">${headline}</div>
				<form method="dialog" id="inner-form" slot="content">
					${content(dialog)}
				</form>
				<div slot="actions">
					${cancelButton
						? (() => {
								cancelButton.buttonType =
									cancelButton.buttonType ?? 'md-text-button';
								const button = literal`${unsafeStatic(
									cancelButton.buttonType
								)}`;
								return staticHtml`
									<${button}
										id="cancelButton"
										style=${styleMap(cancelButton.styles ?? {})}
										@click=${() => {
											if (cancelButton.callback) {
												cancelCallbackPromise = new Promise(async (resolve) => {
													resolve(await cancelButton.callback(dialog));
												});
											}
										}}
										form="inner-form"
										value="${cancelButton.dialogAction ?? 'cancel'}"
										>${cancelButton.label ?? 'Cancel'}</${button}
									>
								`;
						  })()
						: nothing}
					${confirmButton
						? (() => {
								confirmButton.buttonType =
									confirmButton.buttonType ?? 'md-text-button';
								const button = literal`${unsafeStatic(
									confirmButton.buttonType
								)}`;
								return staticHtml`
									<${button}
										id="confirmButton"
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
										form="inner-form"
										value="${confirmButton.dialogAction ?? 'confirm'}"
										>${confirmButton.label ?? 'Confirm'}</${button}
									>
								`;
						  })()
						: nothing}
				</div>
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

		await onDialogReady?.(dialog);
		dialog.show();
	});
}
