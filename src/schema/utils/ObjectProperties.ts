import type { TObject } from '@sinclair/typebox'

export type ObjectProperties<T extends TObject> = T['properties']
export type ObjectPropertyKeys<T extends TObject> = keyof ObjectProperties<T>
