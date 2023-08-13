import {materialConfirm, materialDialog, materialPrompt} from '../src/index.js';
import '@material/web/button/filled-button.js';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/iconbutton/icon-button.js';
import {html} from 'lit-html';

// let i = 0;
// try {
// 	const returnedValue = await dialog({
// 		//  transition: '',
// 		headline: 'Are you sure?',
// 		content(dialog) {
// 			return html`are you sure you want to delete this item?
// 				<b
// 					id="bold"
// 					@click=${() => {
// 						console.log(dialog.$.confirmButton);
// 					}}
// 					>test</b
// 				>`;
// 		},
// 		escapeKeyAction: '',
// 		onDialogReady(dialog) {
// 			dialog.$.bold.setAttribute('style', 'background-color:green');
// 		},
// 		confirmButton: {
// 			dialogAction: '',
// 			async callback(dialog) {
// 				await new Promise((r) => setTimeout(r, 5000));
// 				if (++i == 5) {
// 					dialog?.close();
// 				}
// 				// return 'hum'
// 				//   await new Promise((r) => setTimeout(r, 2000));
// 				// return 'THAT';
// 			},
// 		},
// 		cancelButton: {},
// 	});
// 	console.log('was confirmed');
// 	console.log(`returned value: ${returnedValue}`);
// 	// do something...
// } catch (_) {
// 	console.log('was canceled');
// }

try {
	alert(
		// await prompt({
		// 	p
		// 	confirmButtonType: 'md-text-button',
		// })
		await materialDialog({
			content(dialog) {
				return html`
					<div
						@click=${(e: Event) => {
							e.stopPropagation();
						}}
					>
						<md-icon-button href="https://www.google.fr" target="_blank" form="">
							<md-icon>A</md-icon>
						</md-icon-button>
					</div>
				`;
			},
			// promptText: 'Enter something',
			// confirmButton: {
			// 	label: 'test',
			// 	styles: {},
			// },
			// textfieldType: 'md-outlined-text-field'
		})
	);
} catch (e) {
	console.log('canceled');
}

// try {
// 	await materialConfirm({
// 		confirmButton: {
// 			buttonType: 'md-filled-button',
// 			styles: {
// 				'--md-filled-button-container-color': 'red',
// 			},
// 		},
// 	});
// } catch (e) {
// 	console.log('canceled');
// }
