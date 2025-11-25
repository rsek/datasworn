import ajvFormatPkg from 'ajv-formats'
import Log from '../utils/Log.js'
import { KEYWORDS } from './keywords.js'
import { FORMATS } from './formats.js'
import ajvPkg from 'ajv'

// workaround for https://github.com/ajv-validator/ajv/issues/2132
const Ajv = ajvPkg.default
const addFormats = ajvFormatPkg.default

// Initialize AJV

const AJV = new Ajv({
	logger: Log,
	// passContext: true,
	// removeAdditional: true,
	strict: 'log',
	strictSchema: 'log',
	strictTypes: 'log',
	useDefaults: 'empty',
	validateFormats: true,
	verbose: true,
	// used for code generation
	// code: { source: true, esm: true }
})

for (const format in FORMATS) AJV.addFormat(format, FORMATS[format])

for (const keyword in KEYWORDS)
	AJV.addKeyword({ keyword, ...KEYWORDS[keyword] })

// Type assertion needed due to ajv-formats bundling its own ajv types
addFormats(AJV as unknown as Parameters<typeof addFormats>[0])

export default AJV
