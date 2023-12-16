import { type BuildOptions, build } from 'esbuild'
import NpmDts from 'npm-dts'
import { PKG_DIR_NODE } from '../const.js'
import path from 'path'

const CORE_PKG = path.join(PKG_DIR_NODE, '@datasworn/core')
const CORE_PKG_SRC = path.join(process.cwd(), 'src/pkg-core/index.ts')

const sharedConfig: Pick<
	BuildOptions,
	'entryPoints' | 'bundle' | 'minify' | 'external' | 'alias'
> = {
	entryPoints: [CORE_PKG_SRC],
	external: [
		'micromatch',
		'nanomatch'
		// './Datasworn.js',
		// './DataswornSource.js'
	],
	alias: {
		// 'Datasworn.js': './Datasworn.js',
		// 'DataswornSource.js': './DataswornSource.js'
	},
	bundle: true
	// minify: true
}

// FIXME use path constants instead
await build({
	...sharedConfig,
	platform: 'node', // for CJS
	outfile: path.join(CORE_PKG, 'index.js')
})

await build({
	...sharedConfig,
	platform: 'neutral', // for ESM
	outfile: path.join(CORE_PKG, 'index.esm.js'),
	format: 'esm'
})

const tsc = new NpmDts.Generator(
	{
		entry: CORE_PKG_SRC,
		output: path.join(CORE_PKG, 'index.d.ts'),
		logLevel: NpmDts.ELogLevel.debug
	},
	true,
	true
)

console.log(tsc)

await tsc.generate()
