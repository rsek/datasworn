import { type RecursiveCollectableId } from '../StringTemplateLiterals.js'
import { type ParentOf } from '../Utils.js'
import CollectableId from './CollectableId.js'
import RecursiveCollectionId from './RecursiveCollectionId.js'

class RecursiveCollectable<
	T extends RecursiveCollectableId
> extends CollectableId<T> {
	getParentCollectionId(): RecursiveCollectionId<ParentOf<T>> {
		const { rulesPackage, type: subtype } = this
		const [key] = this.collectionKeys
		const collectionKeys = this.collectionKeys.slice(0, -1) as any
		const options = {
			rulesPackage,
			subtype,
			key,
			collectionKeys
		} satisfies RecursiveCollectionId.Options<ParentOf<T>>
		return new RecursiveCollectionId<ParentOf<T>>(options)
	}
}

namespace RecursiveCollectable {
	export interface Options<T extends RecursiveCollectableId>
		extends CollectableId.Options<T> {}
}

export default RecursiveCollectable
