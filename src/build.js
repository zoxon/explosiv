const builds = require('./build/builds')

async function build(indir, outdir) {
	global.headContents = []
	require('dotenv').config()

	// Clear the require cache
	for (const file of Object.keys(require.cache)) {
		delete require.cache[file]
	}

	for (thread in builds) {
		await builds[thread](indir, outdir)
	}
}

module.exports = build
