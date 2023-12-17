import type IdParser from './IdParser.js'
import type * as StringTemplateLiterals from '../StringTemplateLiterals.js'
import { type CollectableChildOf } from '../Utils.js'
import CollectionId from './CollectionId.js'
import NonRecursiveCollectableId from './NonRecursiveCollectableId.js'

class NonRecursiveCollectionId<
	T extends StringTemplateLiterals.NonRecursiveCollectionId
> extends CollectionId<T> {
	createChildCollectableId<Key extends string>(
		key: Key
	): NonRecursiveCollectableId<CollectableChildOf<T, Key>> {
		const { rulesPackage, key: collectionKey, subtype: type } = this
		const options = {
			rulesPackage,
			type,
			collectionKey,
			key
		} satisfies NonRecursiveCollectableId.Options<CollectableChildOf<T, Key>>

		return new NonRecursiveCollectableId<CollectableChildOf<T, Key>>(options)
	}

	constructor(options: NonRecursiveCollectionId.Options<T> | T) {
		if (typeof options === 'string') super(options)
		else {
			const { rulesPackage, key, subtype } = options
			super({
				rulesPackage,
				subtype,
				key
			})
		}
	}
}
namespace NonRecursiveCollectionId {
	export interface Options<
		T extends StringTemplateLiterals.NonRecursiveCollectionId
	> extends Pick<IdParser.Options<T>, 'rulesPackage' | 'subtype' | 'key'> {}
}

export default NonRecursiveCollectionId
