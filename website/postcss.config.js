const postcssConfig = {
	plugins: [
		require('cssnano')({
			preset: 'default',
		})
	],
};

module.exports = postcssConfig;