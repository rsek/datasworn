/** Rebuilds the `dist` folder with the contents of the distributable package */

import { buildCorePackage } from './buildCorePackage.js'
import * as config from '../pkgConfig.js'
import { buildContentPackage } from './buildContentPackage.js'
import Log from '../../utils/Log.js'

const profiler = Log.startTimer()

await Promise.all([
	buildCorePackage(),
	...Object.values(config).map(async (pkg) => buildContentPackage(pkg))
])

profiler.done({
	message: `Finished in ${Date.now() - profiler.start.valueOf()}ms`
})
