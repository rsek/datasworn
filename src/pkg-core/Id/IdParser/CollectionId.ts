import IdParser from './IdParser.js'
import { type AnyCollectionId } from '../StringTemplateLiterals.js'
import { type CollectableChildOf } from '../Utils.js'
import type CollectableId from './CollectableId.js'

abstract class CollectionId<T extends AnyCollectionId> extends IdParser<T> {
	constructor(options: CollectionId.Options<T> | T) {
		if (typeof options === 'string') super(options)
		else {
			const { rulesPackage, subtype, key, collectionKeys } = options
			super({
				rulesPackage,
				type: 'collections',
				subtype,
				collectionKeys,
				key
			} as IdParser.Options<T>)
		}
	}

	static get datasworn() {
		return IdParser.datasworn
	}

	static set datasworn(value) {
		IdParser.datasworn = value
	}

	/**
	 * Create an ID to represent a collectable object child of this Collection ID.
	 * @param key The key to use for the collectable object.
	 * @returns A new IdParser instance for the collectable ID, or null if this instance doesn't represent a Collection ID.
	 * @example
	 * ```typescript
	 * const collectionId = new IdParser('starforged/collections/oracles/core')
	 * const childId = collectionId.createCollectableId('action')
	 * console.log(childId.id) // "starforged/oracles/core/action"
	 * ```
	 */
	abstract createChildCollectableId<Key extends string>(
		key: Key
	): CollectableId<CollectableChildOf<T, Key>>
}
namespace CollectionId {
	export interface Options<T extends AnyCollectionId>
		extends Pick<
			IdParser.Options<T>,
			'rulesPackage' | 'subtype' | 'key' | 'collectionKeys'
		> {}
}

export default CollectionId
