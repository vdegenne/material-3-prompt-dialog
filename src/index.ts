import {render, TemplateResult, html, nothing} from 'lit-html';
import {html as staticHtml, literal, unsafeStatic} from 'lit-html/static.js';
import {createRef, ref} from 'lit-html/directives/ref.js';
import {MdDialog} from '@material/web/dialog/dialog.js';
import '@material/web/dialog/dialog.js';
import '@material/web/button/text-button.js';

export interface PromptOptions {
  /**
   * Headline of the dialog.
   */
  headline?: string | TemplateResult;
  /**
   * Content of the dialog.
   */
  content: string | TemplateResult;
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
   * @type {import('@material/web/dialog/dialog.js').MdDialog['transition']}
   * @default 'grow-down'
   */
  transition?: MdDialog['transition'];
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
   * @param {MdDialog} dialog dialog host
   * @returns void
   */
  callback?: (dialog?: MdDialog) => void | Promise<any>;
  /**
   * The default tagname to be used for the button.
   * @default 'md-text-button'
   */
  buttonType?: string;
}

export function prompt(
  {
    headline,
    content = '',
    cancelButton,
    confirmButton,
    transition,
  }: PromptOptions = {content: ''}
) {
  return new Promise(async (resolve, reject) => {
    const dialogref = createRef<MdDialog>();
    const container = document.createElement('div');

    document.body.appendChild(container);

    let cancelCallbackPromise: Promise<any> = Promise.resolve();
    let confirmCallbackPromise: Promise<any> = Promise.resolve();

    render(
      html`
        <md-dialog
          ${ref(dialogref)}
          escapeKeyAction="cancel"
          scrimClickAction="cancel"
          transition=${transition ?? 'grow-down'}
          open
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
            dialogref.value.remove();
            container.remove();
          }}
        >
          <div slot="header">${headline}</div>
          ${content}
          ${cancelButton
            ? (() => {
                cancelButton.buttonType =
                  cancelButton.buttonType ?? 'md-text-button';
                const button = literal`${unsafeStatic(
                  cancelButton.buttonType
                )}`;
                return staticHtml`
									<${button}
										slot="footer"
										@click=${() => {
                      if (cancelButton.callback == undefined) {
                        return;
                      }
                      cancelCallbackPromise = new Promise(async (resolve) => {
                        resolve(await cancelButton.callback(dialogref.value));
                      });
                    }}
										dialogAction="${cancelButton.dialogAction ?? 'cancel'}"
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
										slot="footer"
										@click=${() => {
                      if (confirmButton.callback == undefined) {
                        return;
                      }
                      confirmCallbackPromise = new Promise(async (resolve) => {
                        resolve(await confirmButton.callback(dialogref.value));
                      });
                    }}
										dialogAction="${confirmButton.dialogAction ?? 'confirm'}"
										>${confirmButton.label ?? 'Confirm'}</${button}
									>
								`;
              })()
            : nothing}
        </md-dialog>
      `,
      container
    );
  });
}
