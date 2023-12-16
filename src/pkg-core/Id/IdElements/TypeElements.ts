/**
 * Datasworn ID elements that represent specific types of Datasworn object.
 */
namespace TypeElements {
	/**
	 * ID type element representing a collection. It must be followed by a second ID element indicating its subtype.
	 */
	export const Collection = 'collections' as const
	export type Collection = typeof Collection

	export namespace Collectable {
		/** ID type elements for types that can exist in recursive collections. */
		export const Recursive = ['oracles', 'atlas', 'npcs'] as const
		export type Recursive = (typeof Recursive)[number]

		/** ID type elements for types that can exist in non-recursive collections. */
		export const NonRecursive = ['moves', 'assets'] as const
		export type NonRecursive = (typeof NonRecursive)[number]

		/** Union of ID type elements for types that can exist in recursive or non-recursive collections. */
		export const Any = [...NonRecursive, ...Recursive] as const
		export type Any = Recursive | NonRecursive
	}

	export namespace CollectionSubtype {
		export type Any<T extends Collectable.Any = Collectable.Any> = [
			Collection,
			T
		]
		export type RecursiveSubtype<
			T extends Collectable.Recursive = Collectable.Recursive
		> = Any<T>
		export type NonRecursiveSubtype<
			T extends Collectable.NonRecursive = Collectable.NonRecursive
		> = Any<T>
	}

	/** ID type elements for types that don't use collections at all. */
	export const NonCollectable = [
		'delve_sites',
		'site_themes',
		'site_domains',
		'truths',
		'rarities'
	] as const
	export type NonCollectable = (typeof NonCollectable)[number]

	export const AnyPrimary = [
		...Collectable.Any,
		...NonCollectable,
		Collection
	] as const satisfies readonly AnyPrimary[]
	export type AnyPrimary = Collectable.Any | NonCollectable | Collection

	/** A type element tuple representing a fully-qualified type. The first element is the primary type. Some types have a second element that indicates a subtype.  */
	export type AnyTuple =
		| [Collectable.Any]
		| [NonCollectable]
		| CollectionSubtype.Any
}

export default TypeElements