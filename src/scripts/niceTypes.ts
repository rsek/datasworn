import Codegen from '@sinclair/typebox-codegen'
import Defs from '../schema/Defs.js'
import { isInteger, mapValues, omit, pick } from 'lodash-es'
import {
	TDiscriminatedUnion,
	TUnionEnum,
	ToEnum,
	ToUnion
} from '../schema/Utils.js'
import { type TSchema, Type, CloneType, TypeGuard } from '@sinclair/typebox'
import Log from './utils/Log.js'
// import { CompilerOptions, ScriptTarget } from 'typescript'
// import { shellify } from '../shellify.js'

// const ff: CompilerOptions = {
// 	strict: true,
// 	outDir: 'test',
// 	target: ScriptTarget.ES2015,
// 	declaration: true
// }

// shellify({
// 	command: 'tsc',
// 	args: ['json-typedef/typescript/index.ts']
// })

// current status: this generates quicktype-friendly types... but quicktype mangles TS unions pretty badly :|
// all this config/troubleshooting (which isn't complete yet!) makes
/** Simplifies JSON schema types into types that are less precise, but friendlier to code generation tools like QuickType. */
export function simplifyRecursive(schema: TSchema, allowNumberEnums = false) {
	let base = CloneType(schema)
	if (!base?.title && base?.$id) base.title = base.$id
	switch (true) {
		case TypeGuard.IsLiteralNumber(base): {
			return Type.Integer(pick(base, 'description', 'title'))
		}
		case TypeGuard.IsIntersect(base): {
			// this is used on DelveSite, DelveSiteDomain, and DelveSiteTheme to describe table rows with static numbers. allOf[0] is an unbounded array, while allOf[1] is a tuple.
			return simplifyRecursive({
				...pick(base, 'description', 'title'),
				...base.allOf[0]
			})
		}
		case TypeGuard.IsRecord(base): {
			base.additionalProperties = Object.values(base.patternProperties)[0]
			return {
				...pick(base, 'description', 'title'),
				type: 'object',

				patternProperties: {
					'.*': Object.values(base.patternProperties)[0]
				}
			}
		}
		case TypeGuard.IsUnion(base): {
			base.anyOf = base.anyOf.map((s) => simplifyRecursive(s)) as TSchema[]
			return omit(base, 'required')
		}
		case TDiscriminatedUnion(base): {
			base = ToUnion(base as any)
			base.anyOf = base.anyOf?.map((s: TSchema) => simplifyRecursive(s)) as TSchema[]
			break
		}
		case TUnionEnum(base):
			if (base.enum.every(isInteger) && !allowNumberEnums)
				return Type.Integer(pick(base, 'description', 'title'))
			return ToEnum(base as any)
		case TypeGuard.IsObject(base): {
			base.properties = mapValues(base.properties, (s) => simplifyRecursive(s)) as typeof base.properties
			base.additionalProperties ||= false
			break
		}
		case TypeGuard.IsArray(base): {
			base.items = simplifyRecursive(base.items) as TSchema
			break
		}
	}

	return base
}

// const definitions = mapValues(Defs, simplifyRecursive)

// const result = {
// 	title: CONST.rootType,

// 	anyOf: [{ $ref: 'Ruleset' }, { $ref: 'Expansion' }],
// 	definitions
// }

// const replacer = (k, v) => {
// 	if (k === '$id') return undefined
// 	if (k === '$ref' && typeof v === 'string') return `#/${DefsKey}/` + v

// 	return v
// }

// const data = JSON.stringify( result, replacer, '\t'
// )

// await fs.writeFile('simpleschema.json',data)
// const exports: Codegen.TypeBoxModel['exports'] = new Map(
// 	Object.entries(adjustedDefs)
// )

// const model: Codegen.TypeBoxModel = {
// 	exports,
// 	types: Object.values(adjustedDefs)
// }

// const result = Codegen.ModelToTypeScript.Generate(model)

// const prepend = `
// function format(type: string,value: string) {
//   switch (type) {
//     default:
// 	    return true
//   }
// }

// `
