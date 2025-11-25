export * from './generic/Mixin.js'
export * from './generic/Dictionary.js'
export * from './generic/IdNode.js'
export * from './generic/SourcedNode.js'
export * from './generic/NonCollectableNode.js'
export * from './generic/CollectionNode.js'
export * from './generic/CollectableNode.js'
export * from './generic/Enhance.js'

// Utility type for runtime collection handling
import type { SourcedNode } from './generic/SourcedNode.js'
export type Collection<TContent = any> = {
	contents: Record<string, TContent>
	collections?: Record<string, Collection<any>>
} & SourcedNode

// Utility type for collectable items
export type Collectable<TContent = unknown> = TContent & SourcedNode
