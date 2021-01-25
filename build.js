const fs = require('fs')
const { startService } = require('esbuild')

let Build = async () => {
	const service = await startService();
	try {
		await service.build({
			entryPoints: ['src/build.js', 'src/cli.js'],
			outdir: 'dist',
			bundle: true,
			platform: 'node',
			format: 'cjs',
			external: fs.readdirSync('node_modules')
		});
	} finally {
		service.stop()
	}
}

Build()
	.then(() => console.log('Build successful!'))
	.catch(err => console.log('Error', err))