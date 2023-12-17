import IdParser from './IdParser.js'
import { type AnyCollectableId } from '../StringTemplateLiterals.js'
import { type ParentOf } from '../Utils.js'
import type CollectionId from './CollectionId.js'

abstract class CollectableId<T extends AnyCollectableId> extends IdParser<T> {
	/** Returns a new {@link IdParser} instance for the ID of this object's parent collection, if one exists. */
	abstract getParentCollectionId(): CollectionId<ParentOf<T>>

	static get datasworn() {
		return IdParser.datasworn
	}

	static set datasworn(value) {
		IdParser.datasworn = value
	}
}
namespace CollectableId {
	export interface Options<T extends AnyCollectableId>
		extends Pick<
			IdParser.Options<T>,
			'rulesPackage' | 'type' | 'key' | 'collectionKeys'
		> {}
}

export default CollectableId
