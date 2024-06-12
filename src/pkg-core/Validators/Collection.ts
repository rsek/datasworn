import CONST from '../IdElements/CONST.js'
import type TypeId from '../IdElements/TypeId.js'
import type TypeNode from '../TypeNode.js'

export function validate<
	T extends TypeNode.Collection,
	TChild extends TypeNode.CollectableOf<T>
>(
	obj: T,

	collectionValidator: (childCollection: T) => boolean,
	collectableValidator: (child: TChild) => boolean
) {
	collectionValidator(obj)

	if (!(CONST.ContentsKey in obj)) {
		const children = obj[CONST.ContentsKey]
		for (const k in children) collectableValidator(children[k] as TChild)
	}

	if (!(CONST.CollectionsKey in obj)) {
		const collectionChildren = obj[CONST.CollectionsKey]
		for (const k in collectionChildren)
			validate(collectionChildren[k], collectionValidator, collectableValidator)
	}

	return true
}
