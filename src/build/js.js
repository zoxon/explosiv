const {
	join,
	resolve,
	dirname,
	posix: { join: posixJoin, normalize: posixNormalize },
} = require('path')
const { ensureFile, writeFile, remove } = require('fs-extra')
const { startService } = require('esbuild')
const fg = require('fast-glob')
const newDocument = require('./document')

let buildJS = async (indir, outdir) => {
	const basedir = resolve(outdir)
	const service = await startService()
	global.headContents = []

	try {
		// Part 5: write Into DOM
		let writePageDOM = async (pageDOM, path) => {
			document = newDocument(indir, outdir)
			const rootEl = document.getElementsByClassName('root')[0]

			if (Array.isArray(pageDOM)) {
				pageDOM.forEach((singleEl) => {
					rootEl.appendChild(singleEl)
				})
			} else {
				rootEl.appendChild(pageDOM)
			}

			// Add elements at the top of head
			// TODO: Add better head function
			for (var i = global.headContents.length - 1; i >= 0; i--) {
				document.head.insertBefore(
					global.headContents[i],
					document.head.childNodes[0]
				)
			}

			await ensureFile(path)
			await writeFile(
				path,
				`<!DOCTYPE html>` + document.documentElement.toString()
			)

			rootEl.removeChild(pageDOM)

			for (let node of global.headContents) {
				document.head.removeChild(node)
			}

			global.headContents = []
		}

		// Part 1: transpile files
		const jsFiles = await fg(posixJoin(indir, '/**/*.js'))

		const services = jsFiles.map(async (file) =>
			service.build({
				entryPoints: [file],
				outfile: join(basedir, file),
				bundle: true,
				platform: 'node',
				format: 'cjs',
				loader: {
					'.js': 'jsx',
				},
				jsxFactory: 'Explosiv.el',
				jsxFragment: 'Explosiv.fragment',
				inject: [resolve(__dirname, './explosiv.shim.js')],
			})
		)

		await Promise.all(services)

		// Part 2: Handle configuration
		let pages = await fg(posixJoin(outdir, indir, '/**/*.js'))
		pages = pages.filter(
			(page) => page !== posixJoin(outdir, indir, '_document.js')
		)

		for (let page of pages) {
			const fileExports = require(resolve(page))

			const filePath = posixNormalize(page)
				.split('/')
				.slice(1 + posixNormalize(indir).split('/').length)
				.join('/')
				.slice(0, -3)

			// Part 4: write the component
			let writeComponent = async (path = null) => {
				const props = fileExports.getProps
					? await fileExports.getProps(path)
					: {}

				let src

				if (path) src = join(basedir, dirname(filePath), path, 'index.html')
				else
					src = join(
						basedir,
						filePath.endsWith('index') ? '' : filePath,
						'index.html'
					)

				await writePageDOM(fileExports.default(props), src)
			}

			// Part 2...
			// Checks that the default export is a function
			if (typeof fileExports.default !== 'function')
				throw `Default export from a file in ${indir} must be a funtion`

			if (typeof fileExports.getPaths === 'function') {
				const paths = await fileExports.getPaths()

				for (let path of paths) {
					await writeComponent(path)
				}
			} else {
				await writeComponent()
			}
		}
	} catch (err) {
		throw err
	} finally {
		await remove(join(basedir, indir))

		// The child process can be explicitly killed when it's no longer needed
		service.stop()
	}
}

module.exports = buildJS
