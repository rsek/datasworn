import { type ObjectOptions } from '@sinclair/typebox'
import { type SetRequired } from 'type-fest'
import * as Generic from '../Generic.js'
import { type Id } from '../common/index.js'
import { TableRowMixin } from '../oracles/TableRow.js'

export function DelveCardRow(
	_id: Id.TAnyId,
	options: SetRequired<ObjectOptions, '$id'>
) {
	return Generic.IdentifiedNode(_id, TableRowMixin, options)
}
