import { Type, type Static } from '@sinclair/typebox'
import * as Localize from '../common/Localize.js'

export const EntityPrompt = Type.Object(
	{ text: Type.Ref(Localize.MarkdownString) },
	{
		$id: 'EntityPrompt',
		description:
			'This type is a placeholder and may see signficant changes in v0.2.0.',
		releaseStage: 'experimental'
	}
)
export type EntityPrompt = Static<typeof EntityPrompt>
