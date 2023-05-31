import {prompt} from '../src/index.js';

try {
	await prompt({
		headline: 'Are you sure?',
		content: 'are you sure you want to delete this item?',
		confirmButton: {},
	});
	console.log('was confirmed');
	// do something...
} catch (_) {
	console.log('was canceled');
}
