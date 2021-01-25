const {
	resolve,
	posix: { join },
} = require('path')
const { copy, readFile, writeFile, exists } = require('fs-extra')
const postcss = require('postcss')
const fg = require('fast-glob')

let buildStatic = async (_, outdir) => {
	const basedir = resolve(outdir)
	// Start the esbuild child process once

	if (await exists(resolve('public'))) await copy(resolve('public'), basedir)

	const cssFiles = await fg(join(outdir, '/**/*.css'))

	let postcssPlugins = null

	if (await exists(resolve('postcss.config.js'))) {
		const postcssConfig = require(resolve('postcss.config.js'))
		postcssPlugins = postcssConfig.plugins
	}

	if (postcssPlugins && postcssPlugins !== null) {
		const cssProcessor = postcss(postcssPlugins)

		for (let file of cssFiles) {
			const filePath = resolve(file)
			const result = await cssProcessor.process(await readFile(filePath), {
				from: filePath,
			})
			await writeFile(filePath, result.css)
		}
	}
}

module.exports = buildStatic
