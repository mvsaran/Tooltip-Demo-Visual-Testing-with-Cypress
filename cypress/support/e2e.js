import './commands'
// register image snapshot command in a way compatible with different plugin versions
try {
	// newer versions export a helper to add the command
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const cis = require('cypress-image-snapshot/command');
	if (cis && typeof cis.addMatchImageSnapshotCommand === 'function') {
		cis.addMatchImageSnapshotCommand();
	} else if (cis && typeof cis === 'function') {
		// some versions export the command directly as a function
		cis();
	}
} catch (err) {
	// plugin not installed or incompatible; visual tests will fail until installed
}