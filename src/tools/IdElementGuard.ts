import Patterns from './Patterns.js'
import * as Const from './const.js'

namespace IdElementGuard {
	export function DictKey(value: unknown): value is Const.DictKey {
		return typeof value === 'string' && Patterns.DictKey.test(value)
	}

	export function Wildcard(value: unknown): value is Const.Wildcard {
		return value === Const.Wildcard
	}

	export function RecursiveWildcard(
		value: unknown
	): value is Const.RecursiveWildcard {
		return value === Const.RecursiveWildcard
	}

	export function CollectionSubtypeElement(
		value: unknown
	): value is Const.CollectionSubtypeElement {
		return (
			typeof value === 'string' &&
			Const.CollectionSubtypeElement.includes(
				value as Const.CollectionSubtypeElement
			)
		)
	}

	export function RecursiveCollectionSubtypeElement(
		value: unknown
	): value is Const.RecursiveCollectionSubtypeElement {
		return (
			typeof value === 'string' &&
			Const.RecursiveCollectionSubtypeElement.includes(
				value as Const.RecursiveCollectionSubtypeElement
			)
		)
	}

	export function NonRecursiveCollectionSubtypeElement(
		value: unknown
	): value is Const.NonRecursiveCollectionSubtypeElement {
		return (
			typeof value === 'string' &&
			Const.NonRecursiveCollectionSubtypeElement.includes(
				value as Const.NonRecursiveCollectionSubtypeElement
			)
		)
	}

	export function NonCollectableTypeElement(
		value: unknown
	): value is Const.NonCollectableTypeElement {
		return (
			typeof value === 'string' &&
			Const.NonCollectableTypeElement.includes(
				value as Const.NonCollectableTypeElement
			)
		)
	}
	export function CollectableTypeElement(
		value: unknown
	): value is Const.CollectableTypeElement {
		return (
			typeof value === 'string' &&
			Const.CollectableTypeElement.includes(
				value as Const.CollectableTypeElement
			)
		)
	}
	export function AnyTypeElement(
		value: unknown
	): value is Const.NonCollectableTypeElement | Const.CollectableTypeElement {
		return NonCollectableTypeElement(value) ?? NonCollectableTypeElement(value)
	}
	export function RecursiveCollectableTypeElement(
		value: unknown
	): value is Const.RecursiveCollectableTypeElement {
		return (
			typeof value === 'string' &&
			Const.RecursiveCollectableTypeElement.includes(
				value as Const.RecursiveCollectableTypeElement
			)
		)
	}
	export function NonRecursiveCollectableTypeElement(
		value: unknown
	): value is Const.NonRecursiveCollectableTypeElement {
		return (
			typeof value === 'string' &&
			Const.NonRecursiveCollectableTypeElement.includes(
				value as Const.NonRecursiveCollectableTypeElement
			)
		)
	}
}
export default IdElementGuard
