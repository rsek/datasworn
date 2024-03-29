/**
 * @type {import('prettier').Config }
 */
module.exports = {
	arrowParens: 'always',
	bracketSameLine: true,
	bracketSpacing: true,
	embeddedLanguageFormatting: 'auto',
	endOfLine: 'lf',
	htmlWhitespaceSensitivity: 'css',
	insertPragma: false,
	jsxSingleQuote: true,
	printWidth: 80,
	proseWrap: 'preserve',
	quoteProps: 'as-needed',
	requirePragma: false,
	semi: false,
	singleQuote: true,
	tabWidth: 2,
	trailingComma: 'none',
	vueIndentScriptAndStyle: false,
	// spaces are really crappy for accessibility: https://adamtuttle.codes/blog/2021/tabs-vs-spaces-its-an-accessibility-issue/
	useTabs: true
}
