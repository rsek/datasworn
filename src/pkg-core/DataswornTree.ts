import { type RulesPackage } from './Datasworn.js'

/** The Datasworn data tree. This is the root object that contains all RulesPackage objects, keyed by their IDs. */
export class DataswornTree extends Map<string, RulesPackage> {
	constructor(...rulesPackages: RulesPackage[]) {
		super()
		this.add(...rulesPackages)
	}

	/** Adds rules packages to the tree, using their id property as the key. */
	add(...rulesPackages: RulesPackage[]) {
		for (const rulesPackage of rulesPackages)
			this.set(rulesPackage._id, rulesPackage)
		return this
	}

	override set(key: string, value: RulesPackage) {
		if (value._id !== key)
			throw new Error(
				`Expected a Datasworn RulesPackage object with ID "${key}", but the RulesPackage ID is ${value._id}`
			)
		return super.set(key, value)
	}
}
