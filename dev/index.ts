import {materialDialog, materialPrompt} from '../src/index.js';
import '@material/web/all.js';
import {html} from 'lit-html';

try {
	alert(
		await materialDialog({
			content(dialog) {
				return html`
					<div
						@click=${(e: Event) => {
							e.stopPropagation();
						}}
					>
						<md-icon-button
							href="https://www.google.fr"
							target="_blank"
							form=""
						>
							<md-icon>A</md-icon>
						</md-icon-button>

					<md-filled-text-field autofocus></md-filled-text-field>
					<md-filled-button>test</md-filled-button>
					</div>
				`;
			},
		})
	);
} catch (e) {
	alert('canceled');
}

// try {
// 	alert(
// 		await materialPrompt({
// 			promptText: 'hello',
// 		})
// 	);
// } catch (e) {
// 	alert('canceled');
// }
