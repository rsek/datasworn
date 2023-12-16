import { type BuildOptions, build } from 'esbuild'
import NpmDts from 'npm-dts'
import { PKG_DIR_NODE } from '../const.js'
import path from 'path'

const CORE_PKG = path.join(PKG_DIR_NODE, '@datasworn/core')
const CORE_PKG_SRC = path.join(process.cwd(), 'src/pkg-core/index.ts')

'tsc src/pkg-core/index.ts --declaration --outDir pkg/nodejs/@datasworn/core --target ES2016 --lib es2022 --skipLibCheck --moduleResolution nodenext'