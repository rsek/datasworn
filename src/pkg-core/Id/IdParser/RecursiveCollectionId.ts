import type * as StringTemplateLiterals from '../StringTemplateLiterals.js'
import {
	type CollectableChildOf,
	type CollectionChildOf,
	type ExtractAncestorKeys,
	type ParentOf
} from '../Utils.js'
import CollectionId from './CollectionId.js'
import RecursiveCollectable from './RecursiveCollectableId.js'

class RecursiveCollectionId<
	T extends StringTemplateLiterals.RecursiveCollectionId
> extends CollectionId<T> {
	/** Returns a new {@link RecursiveCollectionId} instance for the ID of this object's parent RecursiveCollection, if one exists, or null if no parent RecursiveCollection is possible. */
	getParentCollectionId(): RecursiveCollectionId<ParentOf<T>> | null {
		if (this.collectionKeys.length === 0) return null

		const { rulesPackage, subtype } = this
		const collectionKeys = this.collectionKeys.slice(
			0,
			-1
		) as RecursiveCollectionId.Options<ParentOf<T>>['collectionKeys']
		const [key] = this.collectionKeys.slice(-1)
		const options = {
			rulesPackage,
			subtype,
			collectionKeys,
			key
		} satisfies RecursiveCollectionId.Options<ParentOf<T>>

		return new RecursiveCollectionId<ParentOf<T>>(options)
	}

	/**
	 * Create an ID to represent a child collection of this recursive collection ID.
	 * @param key The key to use for the child collection.
	 * @returns A new IdParser instance for the child collection ID, or null if this instance has a subtype that can't recurse.
	 * @throws If this collection has already reached its maximum recursion depth (3).
	 * @example
	 * ```typescript
	 * const collectionId = new IdParser('starforged/collections/oracles/planets')
	 * const childCollectionId = collectionId.createChildCollectionId('furnace')
	 * console.log(childCollectionId.id) // "starforged/collections/oracles/planets/furnace"
	 * ```
	 */
	createChildCollectionId<Key extends string>(key: Key) {
		const { rulesPackage, subtype } = this

		const collectionKeys = [
			...(this.collectionKeys as any),
			this.key
		] as string[] as RecursiveCollectionId.Options<
			CollectionChildOf<T, Key>
		>['collectionKeys']
		const options = {
			rulesPackage,
			subtype,
			collectionKeys,
			key
		} satisfies RecursiveCollectionId.Options<CollectionChildOf<T, Key>>
		return new RecursiveCollectionId<
			CollectionChildOf<T & StringTemplateLiterals.RecursiveCollectionId, Key>
		>(options)
	}

	createChildCollectableId<Key extends string>(
		key: Key
	): RecursiveCollectable<CollectableChildOf<T, Key>> {
		if (this.isCollection) {
			const { rulesPackage, subtype: type } = this
			const collectionKeys = [
				...this.collectionKeys,
				this.key
			] as string[] as ExtractAncestorKeys<CollectableChildOf<T, Key>>
			const options = {
				rulesPackage,
				type,
				collectionKeys,
				key
			} satisfies RecursiveCollectable.Options<CollectableChildOf<T, Key>>

			return new RecursiveCollectable<CollectableChildOf<T, Key>>(
				options as any
			)
		}

		return null
	}
}

namespace RecursiveCollectionId {
	export interface Options<
		T extends StringTemplateLiterals.RecursiveCollectionId
	> extends CollectionId.Options<T> {}
}

export default RecursiveCollectionId
