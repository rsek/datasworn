import { ContentsKey, CollectionsKey } from '../IdElements/CONST.js'
import type TypeNode from '../TypeNode.js'

export function validate<
	T extends TypeNode.Collection,
	TChild extends TypeNode.CollectableOf<T>,
>(
	obj: T,

	collectionValidator: (childCollection: T) => boolean,
	collectableValidator: (child: TChild) => boolean
) {
	collectionValidator(obj)

	if (ContentsKey in obj) {
		const children = obj[ContentsKey]
		for (const k in children) collectableValidator(children[k] as TChild)
	}

	if (CollectionsKey in obj) {
		const collectionChildren = obj[CollectionsKey]
		for (const k in collectionChildren)
			validate(collectionChildren[k] as T, collectionValidator, collectableValidator)
	}

	return true
}
