/** Utilities to compose regular expressions for IDs and dictionary keys. */

import {
	Type,
	CloneType,
	type ObjectOptions,
	type StringOptions,
	type TString,
	type TUnion
} from '@sinclair/typebox'
import { escapeRegExp, omit } from 'lodash-es'
import { JsonTypeDef } from '../Symbols.js'
import { setSourceDataSchema } from './Computed.js'
import { type SetOptional } from './SetOptional.js'
import Pattern from '../../pkg-core/IdElements/Pattern.js'
import CONST from '../../pkg-core/IdElements/CONST.js'

const sep = escapeRegExp(CONST.Sep)
const propSep = escapeRegExp(CONST.PropSep)
const wc = escapeRegExp(CONST.WildcardString)
const wce = escapeRegExp(CONST.GlobstarString)
const node = Pattern.DictKeyElement
const namespace = Pattern.RulesPackageElement
const index = /\d+/
const nodeRecursive = recurse(node)

const recursiveElementWildcard = oneOf(
	nodeRecursive,
	new RegExp(sep + wce),
	new RegExp(sep + wce + sep + node.source),
	new RegExp(sep + node.source + sep + wce)
)

export const Pkg = Symbol(namespace.source)
export type Pkg = typeof Pkg
export const Node = Symbol(node.source)
export type Node = typeof Node
export const NodeRecursive = Symbol(nodeRecursive.source)
export type NodeRecursive = typeof NodeRecursive
export const Index = Symbol(index.source)
export type Index = typeof Index
const noSeparator = [NodeRecursive]
type IdElementSymbol = Pkg | NodeRecursive | Node | Index
export type IdElement = IdElementSymbol | string | PropertyElement

export const PatternElements = Symbol('PatternElements')
type IdOptions = StringOptions & { $id: string }
type TId = TString &
	IdOptions & {
		[PatternElements]: IdElement[]
		pattern: string
	}
type TIdUnion = TUnion<Array<Omit<TId, '$id'> & TString>>

export function IdUnion(members: TId[], options: ObjectOptions) {
	const jtdRegex = oneOf(
		...members.map(
			(item) =>
				new RegExp(getPatternSubstrings(...item[PatternElements]).join(''))
		)
	)

	// console.log(jtdRegex.source)

	const extendedOptions = {
		[JsonTypeDef]: {
			schema: {
				type: 'string',
				metadata: {
					pattern: `^${jtdRegex.source}$`
				}
			}
		},
		...options
	}

	return Type.Union(members, extendedOptions) as TIdUnion
}

export function Id(elements: IdElement[], options: IdOptions) {
	const targetName = options.$id.replace(/Id$/, '')
	const indefiniteArticle = targetName.match(/^[AEIOU]/) ? 'an' : 'a'
	const baseRegex = new RegExp(
		`^${getPatternSubstrings(...elements)
			// .map((el, i, arr) => {
			// 	// skip if it's a single element - no meaningful groups
			// 	if (arr.length === 1) return el
			// 	// skip if it's a separator element
			// 	if (el.toString() === sep || el.toString() === propSep) return el
			// 	if (el.toString().startsWith('(?') || !el.toString().startsWith('('))
			// 		return '(' + el.toString() + ')'

			// 	return el
			// })
			.join('')}$`
	)
	// the regex needs some clean up to work right in the JSON schema
	const pattern = baseRegex.source
		// clean up any lingering doubled slashes
		.replace('\\/(\\/', '(\\/')
		.replace('\\/((\\/', '((\\/')

	// validate examples against the regex
	// if (options.examples) {
	// 	for (const example of options.examples) {
	// 		if (typeof example !== 'string')
	// 			throw new Error("Got an Id example value that wasn't a string")
	// 		if (!baseRegex.test(example))
	// 			throw new Error(
	// 				`Example ID "${example}" doesn't match the JSON schema regular expression.`
	// 			)
	// 	}
	// }

	const result = Type.String({
		pattern,
		description: `A unique ID for ${indefiniteArticle} ${targetName}.`,
		...options,
		[PatternElements]: elements
	}) as TId

	return result
}
export function RecursiveCollectableId(type: string, options: IdOptions) {
	const base = Id([Pkg, type, NodeRecursive, Node], options)
	return setSourceDataSchema(base, (schema) => {
		// const nuPattern = Id(['{{COLLECTION}}', Node], options)
		return IdUnion(
			[
				omit(CloneType(schema), '$id') as TId,
				{
					...omit(CloneType(schema), '$id')
					// ...pick(nuPattern, PatternElements, 'pattern')
				} as TId
			],
			options
		)
	})
}
export function RecursiveCollectionId(type: string, options: IdOptions) {
	const base = Id([Pkg, type, NodeRecursive], options)
	return base
}
export function CollectableId(type: string, options: IdOptions) {
	const base = Id([Pkg, type, Node, Node], options)
	return setSourceDataSchema(base, (schema) => {
		// const nuPattern = Id(['{{COLLECTION}}', Node], options)
		return IdUnion(
			[
				omit(CloneType(schema), '$id') as TId,
				{
					...omit(CloneType(schema), '$id')
					// ...pick(nuPattern, PatternElements, 'pattern')
				} as TId
			],
			options
		)
	})
}
export function CollectionId(type: string, options: IdOptions) {
	const base = Id([Pkg, type, Node], options)

	return base
}

export function NonCollectableId(type: string, options: IdOptions) {
	const base = Id([Pkg, type, Node], options)

	return base
}

export function PropertyOf(base: TId, append: IdElement[], options: IdOptions) {
	const baseElements = base[PatternElements]

	return Id([...baseElements, ...append], options)
}

export function toWildcardId(
	base: TId,
	options: SetOptional<IdOptions, '$id'> = {}
) {
	if (!options.$id) {
		options.$id = base.$id + 'Wildcard'
	}

	if (base.title && !options.title)
		options.title = base.title + ' (with wildcard)'
	const elements = base[PatternElements].map((item) => _toWildcardElement(item))

	if (!options.description && options.$id) {
		const targetName = options.$id.replace(/IdWildcard$/, '')
		options.description = `A wildcarded ID that can be used to match multiple ${targetName}s.`
	}

	return Id(elements, options as IdOptions)
}

function wildcard(pattern: RegExp) {
	const src = oneOf(new RegExp(wc), pattern).source

	return new RegExp(src)
}
function group(pattern: RegExp) {
	return new RegExp(`(${pattern.source})`)
}
function recurse(pattern: RegExp) {
	return new RegExp(
		`(${sep}${pattern.source}){${CONST.RECURSIVE_PATH_ELEMENTS_MIN},${CONST.RECURSIVE_PATH_ELEMENTS_MAX}}`
	)
}
function oneOf(...items: RegExp[]) {
	return group(new RegExp(items.map((item) => item.source).join('|')))
}

export class PropertyElement {
	key: string

	toString() {
		return this.key
	}

	constructor(key: string) {
		this.key = key
	}
}

function _toWildcardElement<T extends IdElement>(element: T) {
	switch (true) {
		case element instanceof PropertyElement:
			return element.key
		case typeof element === 'string':
			return element
		case element === NodeRecursive:
			return recursiveElementWildcard.source
		default: {
			const src = (element as symbol)?.description as string
			const regexp = new RegExp(src)
			return wildcard(regexp).source
		}
	}
}
function getPatternSubstrings(...elements: IdElement[]) {
	elements = [...elements]

	const idParts = []

	for (let i = 0; i < elements.length; i++) {
		const element = elements[i]

		const nextElement = elements[i + 1]

		const needsSlashSeparator =
			(typeof element === 'string' || !noSeparator.includes(element as any)) &&
			i > 0 &&
			!(element instanceof PropertyElement)
		// &&
		// nextElement?.description?.startsWith('(/')

		if (needsSlashSeparator) idParts.push(sep)
		else if (element instanceof PropertyElement) idParts.push(propSep)

		idParts.push((element as symbol).description ?? element)
	}

	return idParts
}
