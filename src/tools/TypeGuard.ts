import ElementGuard from './ElementGuard.js'
import Patterns from './Patterns.js'
import {
	type RulesPackageId,
	type CollectionId,
	type RecursiveCollectionId,
	type AnyId,
	type NonRecursiveCollectionId
} from './types.js'
import { parseId } from './parseId.js'

namespace TypeGuard {
	export function RulesPackageId(value: unknown): value is RulesPackageId {
		return typeof value === 'string' && Patterns.RulesPackageId.test(value)
	}

	export function AnyId(value: unknown): value is AnyId {
		if (typeof value !== 'string') return false
		if (RulesPackageId(value)) return true

		try {
			const parsed = parseId(value as any)
			return !!parsed
		} catch {
			return false
		}
	}

	export function CollectionId(value: unknown): value is CollectionId {
		if (typeof value !== 'string') return false

		try {
			const parsed = parseId(value as any)
			return ElementGuard.CollectionSubtypeElement(parsed.typeElements)
		} catch {
			return false
		}
	}

	export function RecursiveCollectionId(
		value: unknown
	): value is RecursiveCollectionId {
		if (typeof value !== 'string') return false

		try {
			const parsed = parseId(value as any)
			return ElementGuard.RecursiveCollectionSubtypeElement(parsed.typeElements)
		} catch {
			return false
		}
	}
	export function NonRecursiveCollectionId(
		value: unknown
	): value is NonRecursiveCollectionId {
		if (typeof value !== 'string') return false

		try {
			const parsed = parseId(value as any)
			return ElementGuard.NonRecursiveCollectionSubtypeElement(
				parsed.typeElements
			)
		} catch {
			return false
		}
	}

	export function CollectableId(value: unknown) {
		if (typeof value !== 'string') return false

		try {
			const parsed = parseId(value as any)
			return ElementGuard.CollectableType(parsed.typeElements)
		} catch {
			return false
		}
	}

	export function RecursiveCollectableId(value: unknown) {
		if (typeof value !== 'string') return false

		try {
			const parsed = parseId(value as any)
			return ElementGuard.RecursiveCollectableType(parsed.typeElements)
		} catch {
			return false
		}
	}

	export function NonRecursiveCollectableId(value: unknown) {
		if (typeof value !== 'string') return false

		try {
			const parsed = parseId(value as any)
			return ElementGuard.NonRecursiveCollectableType(parsed.typeElements)
		} catch {
			return false
		}
	}
}

export default TypeGuard
