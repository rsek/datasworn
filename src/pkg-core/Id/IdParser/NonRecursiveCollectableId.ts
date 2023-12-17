import type IdParser from './IdParser.js'
import type * as StringTemplateLiterals from '../StringTemplateLiterals.js'
import { type ParentOf } from '../Utils.js'
import CollectableId from './CollectableId.js'
import NonRecursiveCollectionId from './NonRecursiveCollectionId.js'

class NonRecursiveCollectableId<
	T extends StringTemplateLiterals.NonRecursiveCollectableId
> extends CollectableId<T> {
	/**
	 *
	 */
	constructor(options: T | NonRecursiveCollectableId.Options<T>) {
		if (typeof options === 'string') super(options)
		else {
			const { rulesPackage, key, type, collectionKey } = options

			super({
				rulesPackage,
				collectionKeys: [collectionKey],
				type,
				key
			} as IdParser.Options<T>)
		}
	}

	override getParentCollectionId(): NonRecursiveCollectionId<ParentOf<T>> {
		const { rulesPackage, type: subtype } = this
		const [key] = this.collectionKeys
		const options = {
			rulesPackage,
			subtype,
			key
		} satisfies NonRecursiveCollectionId.Options<ParentOf<T>>

		return new NonRecursiveCollectionId<ParentOf<T>>(options)
	}
}

namespace NonRecursiveCollectableId {
	export interface Options<
		T extends StringTemplateLiterals.NonRecursiveCollectableId
	> extends Omit<CollectableId.Options<T>, 'collectionKeys'> {
		collectionKey: CollectableId.Options<T>['collectionKeys'][0]
	}
}

export default NonRecursiveCollectableId
