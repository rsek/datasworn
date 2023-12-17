import IdParser from './IdParser.js'
import type * as StringTemplateLiterals from '../StringTemplateLiterals.js'

/**
 * Represents an ID for a non-collectable Datasworn object.
 */
class NonCollectableId<
	T extends StringTemplateLiterals.NonCollectableId
> extends IdParser<T> {
	constructor(options: T | NonCollectableId.Options<T>) {
		if (typeof options === 'string') super(options)
		else {
			const { rulesPackage, key, type } = options
			super({ rulesPackage, key, type } as IdParser.Options<T>)
		}
	}

	static get datasworn() {
		return IdParser.datasworn
	}

	static set datasworn(value) {
		IdParser.datasworn = value
	}
}

namespace NonCollectableId {
	export type Options<T extends StringTemplateLiterals.NonCollectableId> = Pick<
		IdParser.Options<T>,
		'rulesPackage' | 'key' | 'type'
	>
}

export default NonCollectableId
