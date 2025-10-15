import {type MdDialog} from '@material/web/dialog/dialog.js';
import {html, render} from 'lit-html';
import {createRef, ref} from 'lit-html/directives/ref.js';

export class DialogBuilder {
	#o: DialogOptions;
	#dialogRef = createRef<MdDialog>();

	get dialog() {
		return this.#dialogRef.value;
	}

	constructor(options?: Partial<DialogOptions>) {
		this.#o = {
			blockScrimClick: false,
			blockEscapeKey: false,
			content: '',
			confirmButton: undefined,
			cancelButton: {},
			styles: undefined,
			headline: undefined,
			onDialogReady: undefined,
			...options,
		};

		const container = document.createElement('div');
		document.body.appendChild(container);

		render(
			html`<!---->
				<md-dialog ${ref(this.#dialogRef)}>
					<!-- headline -->
					${this.#renderHeadline()}
					<!-- content -->
					<form slot="content" method="dialog" id="form">
						${typeof this.#o.content !== 'function'
							? this.#o.content
							: this.#o.content(this.dialog)}
					</form>
					<!-- actions -->
				</md-dialog>
				<!----> `,
			container,
		);
	}
	#postInitialRender() {}

	#renderHeadline() {
		if (!this.#o.headline) return;
		return html`<div slot="headline">${this.#o.headline}</div>`;
	}

	#renderContent() {
		if (typeof this.#o.content === 'function') {
		}
	}

	#renderActions() {}

	show() {
		this.dialog.show();
	}
}
