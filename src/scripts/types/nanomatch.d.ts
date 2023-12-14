declare module 'nanomatch' {
	import FragmentCache from 'fragment-cache'

	type AST = object
	interface Options {
		/**
		 * @default false
		 */
		basename?: boolean
		/**
		 * Enabled by default, this option enforces bash-like behavior with stars immediately following a bracket expression. Bash bracket expressions are similar to regex character classes, but unlike regex, a star following a bracket expression does not repeat the bracketed characters. Instead, the star is treated the same as an other star.
		 * @default true
		 */
		bash?: boolean
		/**
		 *
		 */
		cache?: boolean
		/**
		 * @default false
		 */
		dot?: boolean
		/**
		 *
		 */
		failglob?: boolean
		/**
		 * String or array of glob patterns to match files to ignore.
		 */
		ignore?: string | string[]
		/**
		 * Alias for {@link Options.basename}
		 */
		matchBase?: boolean
		/**
		 * Use a case-insensitive regex for matching files. Same behavior as minimatch.
		 */
		nocase?: boolean
		/**
		 * Remove duplicate elements from the result array.
		 * @default true
		 */
		nodupes?: boolean
		/**
		 * Disable matching with globstars (**).
		 */
		noglobstar?: boolean
		/**
		 * Disallow negation (!) patterns, and treat leading ! as a literal character to match.
		 */
		nonegate?: boolean
		/** Alias for {@link Options.nullglob}. */
		nonull?: boolean
		/** If true, when no matches are found the actual (arrayified) glob pattern is returned instead of an empty array. Same behavior as {@link https://github.com/isaacs/minimatch | minimatch} option nonull. */
		nullglob?: boolean
		/**
		 * Customize the slash character(s) to use for matching.
		 * @default '[/\\]'
		 */
		slash?: string | ((nanomatch: typeof nanomatch) => string)
		/**
		 * Customize the star character(s) to use for matching. It's not recommended that you modify this unless you have advanced knowledge of the compiler and matching rules.
		 * @default '[^/\\]*?'
		 */
		star?: string | ((nanomatch: typeof nanomatch) => string)
		/**
		 * Pass your own instance of snapdragon to customize parsers or compilers.
		 */
		snapdragon?: object
		/**
		 * Generate a source map by enabling the sourcemap option with the .parse, .compile, or .create methods.
		 */
		sourcemap?: boolean
		/**
		 * Remove backslashes from returned matches.
		 */
		unescape?: boolean
		/**
		 * @default true
		 */
		unixify?: boolean
	}

	/**
	 * The main function takes a list of strings and one or more glob patterns to use for matching.
	 * @param list A list of strings to match
	 * @param patterns One or more glob patterns to use for matching.
	 * @param options See available {@link Options|options} for changing how matches are performed
	 * @returns Return an array of matches
	 */
	function nanomatch(
		list: string[],
		patterns: string | string[],
		options?: Options
	): string[]

	namespace nanomatch {
		/**
		 * Similar to the {@link nanomatch|main function}, but pattern must be a string.
		 * @param list Array of strings to match
		 * @param pattern Glob pattern to use for matching.
		 * @param options See available {@link Options|options} for changing how matches are performed
		 * @returns Return an array of matches
		 */
		export function match(
			list: string[],
			patterns: string | string[],
			options?: Options
		)

		/**
		 *
		 * @param string String to match
		 * @param pattern Glob pattern to use for matching.
		 * @param options See available {@link Options|options} for changing how matches are performed
		 * @returns Return `true` if the string matches the glob pattern.
		 */
		export function isMatch(
			string: string,
			pattern: string,
			options?: Options
		): boolean

		/**
		 * Returns `true` if some of the elements in the given `list` match any of the given glob `patterns`.
		 * @param list The string or array of strings to test. Returns as soon as the first match is found.
		 * @param patterns One or more glob patterns to use for matching.
		 * @param options See available {@link Options|options} for changing how matches are performed
		 * @returns Return `true` if any patterns match `str`
		 */
		export function every(
			list: string | string[],
			patterns: string | string[],
			options?: Options
		)

		/**
		 * Returns `true` if any of the given glob patterns match the specified string.
		 * @param str The string to test.
		 * @param patterns One or more glob patterns to use for matching.
		 * @param options See available {@link Options|options} for changing how matches are performed
		 * @returns Return `true` if any patterns match `str`
		 */
		export function any(
			str: string | string[],
			patterns: string | string[],
			options?: Options
		): boolean
		/**
		 * Returns `true` if all of the given patterns match the specified string.
		 *
		 * @param str The string to test.
		 * @param patterns One or more glob patterns to use for matching.
		 * @param options See available {@link Options|options} for changing how matches are performed
		 * @returns Return `true` if any patterns match `str`
		 */
		export function all(
			str: string | string[],
			patterns: string | string[],
			options?: Options
		): boolean
		/**
		 *
		 * @param list Array of strings to match.
		 * @param patterns One or more glob pattern to use for matching.
		 * @param options See available {@link Options|options} for changing how matches are performed
		 * @returns Return an array of strings that do not match the given patterns.
		 */
		export function not(
			list: string[],
			patterns: string | string[],
			options?: Options
		): string[]

		/**
		 *
		 * @param str The string to match.
		 * @param patterns Glob pattern to use for matching.
		 * @param options See available {@link Options|options} for changing how matches are performed
		 * @returns Return true if the patter matches any part of str.
		 */
		export function contains(
			str: string,
			patterns: string | string[],
			options?: Options
		): boolean

		/**
		 * Filter the keys of the given object with the given glob pattern and options. Does not attempt to match nested keys. If you need this feature, use {@link https://github.com/jonschlinkert/glob-object | glob-object} instead.
		 *
		 * @param object The object with keys to filter.
		 * @param patterns One or more glob patterns to use for matching.
		 * @param options See available {@link Options|options} for changing how matches are performed
		 * @returns Return Returns an object with only keys that match the given patterns.
		 */
		export function matchKeys<T extends Record<string, any>>(
			object: T,
			patterns: string | string[],
			options?: Options
		): Partial<T>

		/**
		 * Returns a memoized matcher function from the given glob `pattern` and `options`. The returned function takes a string to match as its only argument and returns true if the string is a match.
		 * @param pattern Glob pattern
		 * @param options See available options for changing how matches are performed.
		 * @returns Return a matcher function.
		 */
		export function matcher(
			pattern: string,
			options?: Options
		): (string: string) => boolean

		/**
		 * Returns an array of matches captured by `pattern` in `string, or
		 * `null` if the pattern did not match.
		 * @param pattern Glob pattern to use for matching.
		 * @param string String to match
		 * @param options See available {@link Options|options} for changing how matches are performed
		 * @return Returns an array of captures if the string matches the glob pattern, otherwise `null`.
		 * @example
		 * ```js
		 * var nm = require('nanomatch');
		 * nm.capture(pattern, string[, options]);
		 *
		 * console.log(nm.capture('test/*.js', 'test/foo.js'));
		 * //=> ['foo']
		 * console.log(nm.capture('test/*.js', 'foo/bar.css'));
		 * //=> null
		 * ```
		 */
		export function capture(
			pattern: string,
			string: string,
			options?: Options
		): string[] | null

		/**
		 * Create a regular expression from the given glob `pattern`.
		 * @example
		 * ```js
		 * var nm = require('nanomatch');
		 * nm.makeRe(pattern[, options]);
		 *
		 * console.log(nm.makeRe('*.js'));
		 * //=> /^(?:(\.[\\\/])?(?!\.)(?=.)[^\/]*?\.js)$/
		 * ```
		 * @param pattern A glob pattern to convert to regex.
		 * @param options See available {@link Options|options} for changing how matches are performed
		 * @return Returns a regex created from the given pattern.
		 */
		export function makeRe(pattern: string, options: Options): RegExp

		/**
		 * Parses the given glob `pattern` and returns an object with the compiled `output`
		 * and optional source `map`.
		 * @param pattern Glob pattern to parse and compile.
		 * @param options Any [options](#options) to change how parsing and compiling is performed.
		 * @return Returns an object with the parsed AST, compiled string and optional source map.
		 * @example
		 * ```js
		 * var nm = require('nanomatch');
		 * nm.create(pattern[, options]);
		 *
		 * console.log(nm.create('abc/*.js'));
		 * // { options: { source: 'string', sourcemap: true },
		 * //   state: {},
		 * //   compilers:
		 * //    { ... },
		 * //   output: '(\\.[\\\\\\/])?abc\\/(?!\\.)(?=.)[^\\/]*?\\.js',
		 * //   ast:
		 * //    { type: 'root',
		 * //      errors: [],
		 * //      nodes:
		 * //       [ ... ],
		 * //      dot: false,
		 * //      input: 'abc/*.js' },
		 * //   parsingErrors: [],
		 * //   map:
		 * //    { version: 3,
		 * //      sources: [ 'string' ],
		 * //      names: [],
		 * //      mappings: 'AAAA,GAAG,EAAC,kBAAC,EAAC,EAAE',
		 * //      sourcesContent: [ 'abc/*.js' ] },
		 * //   position: { line: 1, column: 28 },
		 * //   content: {},
		 * //   files: {},
		 * //   idx: 6 }
		 * ```
		 */
		export function create(pattern: string, options: Options): AST

		/**
		 * Parse the given `str` with the given `options`.
		 * @param str
		 * @param options
		 * @return Returns an AST
		 * @example
		 * ```js
		 * var nm = require('nanomatch');
		 * nm.parse(pattern[, options]);
		 *
		 * var ast = nm.parse('a/{b,c}/d');
		 * console.log(ast);
		 * // { type: 'root',
		 * //   errors: [],
		 * //   input: 'a/{b,c}/d',
		 * //   nodes:
		 * //    [ { type: 'bos', val: '' },
		 * //      { type: 'text', val: 'a/' },
		 * //      { type: 'brace',
		 * //        nodes:
		 * //         [ { type: 'brace.open', val: '{' },
		 * //           { type: 'text', val: 'b,c' },
		 * //           { type: 'brace.close', val: '}' } ] },
		 * //      { type: 'text', val: '/d' },
		 * //      { type: 'eos', val: '' } ] }
		 * ```
		 */
		export function parse(str: string, options: Options): AST

		/**
		 * Compile the given `ast` or string with the given `options`.
		 * @param ast
		 * @param options
		 * @return {Object} Returns an object that has an `output` property with the compiled string.
		 * @example
		 * ```js
		 * var nm = require('nanomatch');
		 * nm.compile(ast[, options]);
		 *
		 * var ast = nm.parse('a/{b,c}/d');
		 * console.log(nm.compile(ast));
		 * // { options: { source: 'string' },
		 * //   state: {},
		 * //   compilers:
		 * //    { eos: [Function],
		 * //      noop: [Function],
		 * //      bos: [Function],
		 * //      brace: [Function],
		 * //      'brace.open': [Function],
		 * //      text: [Function],
		 * //      'brace.close': [Function] },
		 * //   output: [ 'a/(b|c)/d' ],
		 * //   ast:
		 * //    { ... },
		 * //   parsingErrors: [] }
		 * ```
		 */
		export function compile(ast: AST | string, object?: Options): object

		/**
		 * Clear the regex cache.
		 * @example
		 * ```js
		 * nm.clearCache();
		 * ```
		 */

		export function clearCache(): void

		/**
		 * Nanomatch compilers
		 */
		export const compilers
		export const parsers
		export const cache: FragmentCache
	}

	export default nanomatch
}
