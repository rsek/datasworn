// Code generated by jtd-codegen for Go v0.2.1. DO NOT EDIT.

package Dataforged

import (
	"encoding/json"
	"fmt"
	"time"
)

type Dataforged = interface{}

type Asset struct {
	Abilities []AssetAbility `json:"abilities"`

	ID AssetID `json:"id"`

	Name Label `json:"name"`

	Source Source `json:"source"`

	Attachments *AssetAttachment `json:"attachments,omitempty"`

	Controls map[string]AssetControlField `json:"controls,omitempty"`

	// If `true`, this asset counts as an impact (Starforged) or a debility
	// (classic Ironsworn).
	CountAsImpact *bool `json:"count_as_impact,omitempty"`

	Options map[string]AssetOptionField `json:"options,omitempty"`

	Requirement *MarkdownString `json:"requirement,omitempty"`

	// Most assets only benefit to their owner, but certain assets (like
	// Starforged's module and command vehicle assets) are shared amongst the
	// player's allies, too.
	Shared *bool `json:"shared,omitempty"`
}

type AssetAbility struct {
	Enabled bool `json:"enabled"`

	ID AssetAbilityID `json:"id"`

	Text MarkdownString `json:"text"`

	Controls map[string]AssetAbilityControlField `json:"controls,omitempty"`

	ExtendAsset *AssetExtension `json:"extend_asset,omitempty"`

	ExtendMoves []MoveExtension `json:"extend_moves,omitempty"`

	Moves map[string]Move `json:"moves,omitempty"`

	Name *Label `json:"name,omitempty"`

	Options map[string]AssetOptionField `json:"options,omitempty"`
}

type AssetAbilityControlField struct {
	FieldType string

	Checkbox AssetAbilityControlFieldCheckbox

	Clock AssetAbilityControlFieldClock

	Counter AssetAbilityControlFieldCounter
}

func (v AssetAbilityControlField) MarshalJSON() ([]byte, error) {
	switch v.FieldType {
	case "checkbox":
		return json.Marshal(struct { T string `json:"field_type"`; AssetAbilityControlFieldCheckbox }{ v.FieldType, v.Checkbox })
	case "clock":
		return json.Marshal(struct { T string `json:"field_type"`; AssetAbilityControlFieldClock }{ v.FieldType, v.Clock })
	case "counter":
		return json.Marshal(struct { T string `json:"field_type"`; AssetAbilityControlFieldCounter }{ v.FieldType, v.Counter })
	}

	return nil, fmt.Errorf("bad FieldType value: %s", v.FieldType)
}

func (v *AssetAbilityControlField) UnmarshalJSON(b []byte) error {
	var t struct { T string `json:"field_type"` }
	if err := json.Unmarshal(b, &t); err != nil {
		return err
	}

	var err error
	switch t.T {
	case "checkbox":
		err = json.Unmarshal(b, &v.Checkbox)
	case "clock":
		err = json.Unmarshal(b, &v.Clock)
	case "counter":
		err = json.Unmarshal(b, &v.Counter)
	default:
		err = fmt.Errorf("bad FieldType value: %s", t.T)
	}

	if err != nil {
		return err
	}

	v.FieldType = t.T
	return nil
}

type AssetAbilityControlFieldCheckbox struct {
	ID AssetAbilityControlFieldID `json:"id"`

	Label Label `json:"label"`

	Value *bool `json:"value"`
}

type AssetAbilityControlFieldClock struct {
	ID AssetAbilityControlFieldID `json:"id"`

	Label Label `json:"label"`

	Max int8 `json:"max"`

	Min int8 `json:"min"`

	Value int8 `json:"value"`
}

type AssetAbilityControlFieldCounter struct {
	ID AssetAbilityControlFieldID `json:"id"`

	Label Label `json:"label"`

	Max *int8 `json:"max"`

	Min int8 `json:"min"`

	Value int8 `json:"value"`
}

type AssetAbilityControlFieldID = string

type AssetAbilityID = string

type AssetAbilityOptionFieldID = string

// Describes which assets can be attached to this asset. The "canonical" example
// for this are Starforged's Module assets, which can be equipped by Command
// Vehicle assets. See p. 55 of Starforged for more info.
type AssetAttachment struct {
	// Regular expressions matching the IDs of assets that can be attached to this
	// asset.
	Patterns []RegularExpression `json:"patterns"`

	// The maximum number of attached assets. Omitted if there's no upper limit to
	// the number of attached assets.
	Max *uint8 `json:"max,omitempty"`
}

// Asset controls are fields that are expected to change throughout the asset's
// lifespan. The most common example are the condition meters on certain assets.
// A more complex example is the distinct mechanical modes on Ironsworn's
// 'Armored'.
type AssetControlField struct {
	FieldType string

	Checkbox AssetControlFieldCheckbox

	ConditionMeter AssetControlFieldConditionMeter

	SelectAssetExtension AssetControlFieldSelectAssetExtension
}

func (v AssetControlField) MarshalJSON() ([]byte, error) {
	switch v.FieldType {
	case "checkbox":
		return json.Marshal(struct { T string `json:"field_type"`; AssetControlFieldCheckbox }{ v.FieldType, v.Checkbox })
	case "condition_meter":
		return json.Marshal(struct { T string `json:"field_type"`; AssetControlFieldConditionMeter }{ v.FieldType, v.ConditionMeter })
	case "select_asset_extension":
		return json.Marshal(struct { T string `json:"field_type"`; AssetControlFieldSelectAssetExtension }{ v.FieldType, v.SelectAssetExtension })
	}

	return nil, fmt.Errorf("bad FieldType value: %s", v.FieldType)
}

func (v *AssetControlField) UnmarshalJSON(b []byte) error {
	var t struct { T string `json:"field_type"` }
	if err := json.Unmarshal(b, &t); err != nil {
		return err
	}

	var err error
	switch t.T {
	case "checkbox":
		err = json.Unmarshal(b, &v.Checkbox)
	case "condition_meter":
		err = json.Unmarshal(b, &v.ConditionMeter)
	case "select_asset_extension":
		err = json.Unmarshal(b, &v.SelectAssetExtension)
	default:
		err = fmt.Errorf("bad FieldType value: %s", t.T)
	}

	if err != nil {
		return err
	}

	v.FieldType = t.T
	return nil
}

type AssetControlFieldCheckbox struct {
	ID AssetAbilityControlFieldID `json:"id"`

	Label Label `json:"label"`

	Value *bool `json:"value"`
}

type AssetControlFieldConditionMeter struct {
	ID AssetAbilityControlFieldID `json:"id"`

	Label Label `json:"label"`

	Max int8 `json:"max"`

	Min int8 `json:"min"`

	Value int8 `json:"value"`
}

type AssetControlFieldSelectAssetExtensionChoice struct {
	Label Label `json:"label"`

	Value AssetExtension `json:"value"`

	Selected *bool `json:"selected,omitempty"`
}

type AssetControlFieldSelectAssetExtension struct {
	Choices map[string]AssetControlFieldSelectAssetExtensionChoice `json:"choices"`

	ID AssetAbilityControlFieldID `json:"id"`

	Label Label `json:"label"`

	Value *AssetExtension `json:"value,omitempty"`
}

type AssetExtensionAttachments struct {
	Max *uint8 `json:"max,omitempty"`

	Patterns []RegularExpression `json:"patterns,omitempty"`
}

type AssetExtensionControl struct {
	Max *int8 `json:"max,omitempty"`

	Min *int8 `json:"min,omitempty"`
}

// Describes changes applied to an asset by its own abilities or controls.
// Unchanged properties are omitted.
type AssetExtension struct {
	Attachments *AssetExtensionAttachments `json:"attachments,omitempty"`

	// Use the same key as the original control. Currently, only condition meters
	// may be extended in this way.
	Controls map[string]AssetExtensionControl `json:"controls,omitempty"`

	CountAsImpact *bool `json:"count_as_impact,omitempty"`
}

type AssetExtensionChoice struct {
	Label Label `json:"label"`

	Value AssetExtension `json:"value"`
}

type AssetExtensionForeignAttachments struct {
	Max *uint8 `json:"max,omitempty"`

	Patterns []RegularExpression `json:"patterns,omitempty"`
}

type AssetExtensionForeignControl struct {
	Max *int8 `json:"max,omitempty"`

	Min *int8 `json:"min,omitempty"`
}

// Describes changes applied to an asset, usually by another asset. Unchanged
// properties are omitted.
type AssetExtensionForeign struct {
	Extends AssetID `json:"extends"`

	ID AssetAbilityControlFieldID `json:"id"`

	Attachments *AssetExtensionForeignAttachments `json:"attachments,omitempty"`

	// Use the same key as the original control. Currently, only condition meters
	// may be extended in this way.
	Controls map[string]AssetExtensionForeignControl `json:"controls,omitempty"`

	CountAsImpact *bool `json:"count_as_impact,omitempty"`
}

type AssetID = string

// Asset options are fields that are usually only set once, typically when the
// player purchases the asset. The most common examples are the "Name" fields
// on companion assets. A more complex example is the choice of stats on the
// Devotant asset.
type AssetOptionField struct {
	FieldType string

	SelectAssetExtension AssetOptionFieldSelectAssetExtension

	SelectNumber AssetOptionFieldSelectNumber

	SelectStat AssetOptionFieldSelectStat

	Text AssetOptionFieldText
}

func (v AssetOptionField) MarshalJSON() ([]byte, error) {
	switch v.FieldType {
	case "select_asset_extension":
		return json.Marshal(struct { T string `json:"field_type"`; AssetOptionFieldSelectAssetExtension }{ v.FieldType, v.SelectAssetExtension })
	case "select_number":
		return json.Marshal(struct { T string `json:"field_type"`; AssetOptionFieldSelectNumber }{ v.FieldType, v.SelectNumber })
	case "select_stat":
		return json.Marshal(struct { T string `json:"field_type"`; AssetOptionFieldSelectStat }{ v.FieldType, v.SelectStat })
	case "text":
		return json.Marshal(struct { T string `json:"field_type"`; AssetOptionFieldText }{ v.FieldType, v.Text })
	}

	return nil, fmt.Errorf("bad FieldType value: %s", v.FieldType)
}

func (v *AssetOptionField) UnmarshalJSON(b []byte) error {
	var t struct { T string `json:"field_type"` }
	if err := json.Unmarshal(b, &t); err != nil {
		return err
	}

	var err error
	switch t.T {
	case "select_asset_extension":
		err = json.Unmarshal(b, &v.SelectAssetExtension)
	case "select_number":
		err = json.Unmarshal(b, &v.SelectNumber)
	case "select_stat":
		err = json.Unmarshal(b, &v.SelectStat)
	case "text":
		err = json.Unmarshal(b, &v.Text)
	default:
		err = fmt.Errorf("bad FieldType value: %s", t.T)
	}

	if err != nil {
		return err
	}

	v.FieldType = t.T
	return nil
}

type AssetOptionFieldSelectAssetExtensionChoice struct {
	Label Label `json:"label"`

	Value AssetExtension `json:"value"`

	Selected *bool `json:"selected,omitempty"`
}

type AssetOptionFieldSelectAssetExtension struct {
	Choices map[string]AssetOptionFieldSelectAssetExtensionChoice `json:"choices"`

	ID AssetAbilityControlFieldID `json:"id"`

	Label Label `json:"label"`

	Value *AssetExtension `json:"value,omitempty"`
}

type AssetOptionFieldSelectNumberChoice struct {
	Label Label `json:"label"`

	Value int8 `json:"value"`

	Selected *bool `json:"selected,omitempty"`
}

type AssetOptionFieldSelectNumber struct {
	Choices map[string]AssetOptionFieldSelectNumberChoice `json:"choices"`

	ID AssetAbilityOptionFieldID `json:"id"`

	Label Label `json:"label"`

	Value *int8 `json:"value,omitempty"`
}

type AssetOptionFieldSelectStatChoice struct {
	Label Label `json:"label"`

	Value PlayerStat `json:"value"`

	Selected *bool `json:"selected,omitempty"`
}

type AssetOptionFieldSelectStat struct {
	Choices map[string]AssetOptionFieldSelectStatChoice `json:"choices"`

	ID AssetAbilityOptionFieldID `json:"id"`

	Label Label `json:"label"`

	Value *PlayerStat `json:"value,omitempty"`
}

type AssetOptionFieldText struct {
	ID AssetAbilityOptionFieldID `json:"id"`

	Label Label `json:"label"`

	Value *string `json:"value,omitempty"`
}

// Challenge rank represented as a number from 1 (troublesome) to 5 (epic)
type ChallengeRank = uint8

// A valid CSS color.
type Color = string

type DelveSiteDenizenFrequency string

const (
	DelveSiteDenizenFrequencyCommon DelveSiteDenizenFrequency = "common"

	DelveSiteDenizenFrequencyRare DelveSiteDenizenFrequency = "rare"

	DelveSiteDenizenFrequencyUncommon DelveSiteDenizenFrequency = "uncommon"

	DelveSiteDenizenFrequencyUnforeseen DelveSiteDenizenFrequency = "unforeseen"

	DelveSiteDenizenFrequencyVeryCommon DelveSiteDenizenFrequency = "very_common"
)

type DelveSiteDenizen struct {
	Frequency DelveSiteDenizenFrequency `json:"frequency"`

	High uint8 `json:"high"`

	Low uint8 `json:"low"`

	Encounter *ID `json:"encounter,omitempty"`

	Name *Label `json:"name,omitempty"`
}

type DelveSiteDomainCardType string

const (
	DelveSiteDomainCardTypeDomain DelveSiteDomainCardType = "domain"
)

type DelveSiteDomain struct {
	CardType DelveSiteDomainCardType `json:"card_type"`

	Dangers []FeatureOrDanger `json:"dangers"`

	Features []FeatureOrDanger `json:"features"`

	ID DelveSiteDomainID `json:"id"`

	Name Label `json:"name"`

	Source Source `json:"source"`

	Summary MarkdownString `json:"summary"`

	Description *MarkdownString `json:"description,omitempty"`

	Icon *SvgImageURL `json:"icon,omitempty"`

	Suggestions *Suggestions `json:"suggestions,omitempty"`
}

type DelveSiteDomainID = string

type DelveSiteThemeCardType string

const (
	DelveSiteThemeCardTypeTheme DelveSiteThemeCardType = "theme"
)

type DelveSiteTheme struct {
	CardType DelveSiteThemeCardType `json:"card_type"`

	Dangers []FeatureOrDanger `json:"dangers"`

	Features []FeatureOrDanger `json:"features"`

	ID DelveSiteThemeID `json:"id"`

	Name Label `json:"name"`

	Source Source `json:"source"`

	Summary MarkdownString `json:"summary"`

	Description *MarkdownString `json:"description,omitempty"`

	Icon *SvgImageURL `json:"icon,omitempty"`

	Suggestions *Suggestions `json:"suggestions,omitempty"`
}

type DelveSiteThemeID = string

type EncounterNatureClassic = string

type EncounterNatureStarforged = string

type EncounterStarforged struct {
	Description MarkdownString `json:"description"`

	Drives []MarkdownString `json:"drives"`

	Features []MarkdownString `json:"features"`

	ID ID `json:"id"`

	Name Label `json:"name"`

	Nature EncounterNatureStarforged `json:"nature"`

	QuestStarter MarkdownString `json:"quest_starter"`

	Rank ChallengeRank `json:"rank"`

	Source Source `json:"source"`

	Summary MarkdownString `json:"summary"`

	Tactics []MarkdownString `json:"tactics"`

	Suggestions *Suggestions `json:"suggestions,omitempty"`

	Variants map[string]EncounterVariantStarforged `json:"variants,omitempty"`
}

type EncounterVariantStarforged struct {
	Description MarkdownString `json:"description"`

	ID ID `json:"id"`

	Name Label `json:"name"`

	Nature EncounterNatureStarforged `json:"nature"`

	Rank ChallengeRank `json:"rank"`
}

type FeatureOrDanger struct {
	High uint8 `json:"high"`

	ID ID `json:"id"`

	Low uint8 `json:"low"`

	Result MarkdownString `json:"result"`

	Description *MarkdownString `json:"description,omitempty"`

	EmbedTable *ID `json:"embed_table,omitempty"`

	Icon *SvgImageURL `json:"icon,omitempty"`

	Rolls []OracleTableRoll `json:"rolls,omitempty"`

	Suggestions *Suggestions `json:"suggestions,omitempty"`

	Summary *MarkdownString `json:"summary,omitempty"`

	Template *OracleRollTemplate `json:"template,omitempty"`
}

type ID = string

// A user-facing text label or name.
type Label = string

// A rich text string in Markdown. Usually this is a direct excerpt from the
// rules text.
// 
//       The custom syntax `{{table:some_oracle_table_id}}` represents a
// markdown table rendered from oracle data.
type MarkdownString = string

type Move struct {
	ID MoveID `json:"id"`

	Name Label `json:"name"`

	Outcomes MoveOutcomes `json:"outcomes"`

	Source Source `json:"source"`

	Text MarkdownString `json:"text"`

	Trigger Trigger `json:"trigger"`

	Suggestions *Suggestions `json:"suggestions,omitempty"`
}

type MoveCategory struct {
	CanonicalName Label `json:"canonical_name"`

	Color Color `json:"color"`

	Contents map[string]Move `json:"contents"`

	ID MoveCategoryID `json:"id"`

	Name Label `json:"name"`

	Source Source `json:"source"`

	Summary MarkdownString `json:"summary"`

	Description *MarkdownString `json:"description,omitempty"`

	Suggestions *Suggestions `json:"suggestions,omitempty"`
}

type MoveCategoryID = string

type MoveExtension struct {
	Extends []MoveID `json:"extends"`

	Trigger TriggerExtension `json:"trigger"`

	Outcomes *MoveOutcomesExtension `json:"outcomes,omitempty"`

	Text *MarkdownString `json:"text,omitempty"`
}

type MoveID = string

type MoveOutcome struct {
	Text MarkdownString `json:"text"`

	CountAs *MoveOutcomeType `json:"count_as,omitempty"`

	Reroll *MoveReroll `json:"reroll,omitempty"`
}

type MoveOutcomeExtensionReroll struct {
	Method *MoveRerollMethod `json:"method,omitempty"`

	Text *MarkdownString `json:"text,omitempty"`
}

// Extends or upgrades an outcome from an existing move.
type MoveOutcomeExtension struct {
	CountAs *MoveOutcomeType `json:"count_as,omitempty"`

	Reroll *MoveOutcomeExtensionReroll `json:"reroll,omitempty"`

	Text *MarkdownString `json:"text,omitempty"`
}

type MoveOutcomeMatchable struct {
	Text MarkdownString `json:"text"`

	CountAs *MoveOutcomeType `json:"count_as,omitempty"`

	Match *MoveOutcome `json:"match,omitempty"`

	Reroll *MoveReroll `json:"reroll,omitempty"`
}

type MoveOutcomeMatchableExtensionReroll struct {
	Method *MoveRerollMethod `json:"method,omitempty"`

	Text *MarkdownString `json:"text,omitempty"`
}

// Extends or upgrades an outcome from an existing move.
type MoveOutcomeMatchableExtension struct {
	CountAs *MoveOutcomeType `json:"count_as,omitempty"`

	Match *MoveOutcomeExtension `json:"match,omitempty"`

	Reroll *MoveOutcomeMatchableExtensionReroll `json:"reroll,omitempty"`

	Text *MarkdownString `json:"text,omitempty"`
}

type MoveOutcomeType string

const (
// The player's score doesn't beat any challenge dice.
	MoveOutcomeTypeMiss MoveOutcomeType = "miss"

// The player's score beats both of the challenge dice.
	MoveOutcomeTypeStrongHit MoveOutcomeType = "strong_hit"

// The player's score beats one of the challenge dice.
	MoveOutcomeTypeWeakHit MoveOutcomeType = "weak_hit"
)

type MoveOutcomes struct {
	Miss MoveOutcomeMatchable `json:"miss"`

	StrongHit MoveOutcomeMatchable `json:"strong_hit"`

	WeakHit MoveOutcome `json:"weak_hit"`
}

// Extends or upgrades one or more outcomes of an existing move.
type MoveOutcomesExtension struct {
	Miss *MoveOutcomeMatchableExtension `json:"miss,omitempty"`

	StrongHit *MoveOutcomeMatchableExtension `json:"strong_hit,omitempty"`

	WeakHit *MoveOutcomeExtension `json:"weak_hit,omitempty"`
}

type MoveReroll struct {
	Method MoveRerollMethod `json:"method"`

	// Describes the trigger condition for the reroll, if any.
	Text *MarkdownString `json:"text,omitempty"`
}

type MoveRerollMethod string

const (
// Reroll the action die
	MoveRerollMethodActionDie MoveRerollMethod = "action_die"

// Reroll all dice
	MoveRerollMethodAll MoveRerollMethod = "all"

// Reroll any number of dice
	MoveRerollMethodAny MoveRerollMethod = "any"

// Reroll any number of challenge dice
	MoveRerollMethodChallengeDice MoveRerollMethod = "challenge_dice"

// Reroll one of the challenge dice
	MoveRerollMethodChallengeDie MoveRerollMethod = "challenge_die"
)

type MoveRollMethod string

const (
// When rolling with this move trigger option, *every* stat or progress track of
// the `using` key is rolled
	MoveRollMethodAll MoveRollMethod = "all"

// When rolling with this move trigger option, the player picks which stat to
// use.
	MoveRollMethodAny MoveRollMethod = "any"

// When rolling with this move trigger option, use the highest/best option from
// the `using` key.
	MoveRollMethodHighest MoveRollMethod = "highest"

// When rolling with this move trigger option, use the lowest/worst option from
// the `using` key.
	MoveRollMethodLowest MoveRollMethod = "lowest"

// Take an automatic miss instead of rolling.
	MoveRollMethodMiss MoveRollMethod = "miss"

// Take an automatic strong hit instead of rolling.
	MoveRollMethodStrongHit MoveRollMethod = "strong_hit"

// Take an automatic weak hit instead of rolling.
	MoveRollMethodWeakHit MoveRollMethod = "weak_hit"
)

type OracleCollection struct {
	CanonicalName Label `json:"canonical_name"`

	Contents map[string]OracleTable `json:"contents"`

	ID OracleCollectionID `json:"id"`

	Name Label `json:"name"`

	Source Source `json:"source"`

	Summary MarkdownString `json:"summary"`

	Collections map[string]OracleCollection `json:"collections,omitempty"`

	Color *Color `json:"color,omitempty"`

	Description *MarkdownString `json:"description,omitempty"`

	Rendering *OracleCollectionRendering `json:"rendering,omitempty"`

	SampleNames []Label `json:"sample_names,omitempty"`

	Suggestions *Suggestions `json:"suggestions,omitempty"`

	Template *OracleRollTemplate `json:"template,omitempty"`
}

type OracleCollectionColumn struct {
	ContentType OracleColumnContentType `json:"content_type"`

	TableKey string `json:"table_key"`

	Color *Color `json:"color,omitempty"`

	Label *Label `json:"label,omitempty"`
}

type OracleCollectionID = string

type OracleCollectionRendering struct {
	Columns map[string]OracleCollectionColumn `json:"columns"`

	Color *Color `json:"color,omitempty"`

	Style *OracleCollectionStyle `json:"style,omitempty"`
}

type OracleCollectionStyle string

const (
	OracleCollectionStyleMultiTable OracleCollectionStyle = "multi_table"
)

type OracleColumnContentType string

const (
	OracleColumnContentTypeDescription OracleColumnContentType = "description"

	OracleColumnContentTypeRange OracleColumnContentType = "range"

	OracleColumnContentTypeResult OracleColumnContentType = "result"

	OracleColumnContentTypeSummary OracleColumnContentType = "summary"
)

type OracleRollTemplate struct {
	Description *TemplateString `json:"description,omitempty"`

	Result *TemplateString `json:"result,omitempty"`

	Summary *TemplateString `json:"summary,omitempty"`
}

type OracleTable struct {
	CanonicalName Label `json:"canonical_name"`

	ID OracleTableID `json:"id"`

	Name Label `json:"name"`

	Source Source `json:"source"`

	Table []OracleTableRow `json:"table"`

	Description *MarkdownString `json:"description,omitempty"`

	Match *OracleTableMatchBehavior `json:"match,omitempty"`

	Rendering *OracleTableRendering `json:"rendering,omitempty"`

	Suggestions *Suggestions `json:"suggestions,omitempty"`

	Summary *MarkdownString `json:"summary,omitempty"`
}

type OracleTableColumn struct {
	ContentType OracleColumnContentType `json:"content_type"`

	Label *Label `json:"label,omitempty"`
}

type OracleTableID = string

type OracleTableMatchBehavior struct {
	Text MarkdownString `json:"text"`
}

type OracleTableRendering struct {
	Color *Color `json:"color,omitempty"`

	Columns map[string]OracleTableColumn `json:"columns,omitempty"`

	Icon *SvgImageURL `json:"icon,omitempty"`

	Style *OracleTableStyle `json:"style,omitempty"`
}

type OracleTableRoll struct {
	Oracle OracleTableID `json:"oracle"`

	Method *OracleTableRollMethod `json:"method,omitempty"`

	Times *uint8 `json:"times,omitempty"`
}

type OracleTableRollMethod string

const (
	OracleTableRollMethodKeepDuplicates OracleTableRollMethod = "keep_duplicates"

	OracleTableRollMethodMakeItWorse OracleTableRollMethod = "make_it_worse"

	OracleTableRollMethodNoDuplicates OracleTableRollMethod = "no_duplicates"
)

type OracleTableRow struct {
	High *uint8 `json:"high"`

	ID OracleTableRowID `json:"id"`

	Low *uint8 `json:"low"`

	Result MarkdownString `json:"result"`

	Description *MarkdownString `json:"description,omitempty"`

	EmbedTable *OracleTableID `json:"embed_table,omitempty"`

	Icon *SvgImageURL `json:"icon,omitempty"`

	Rolls []OracleTableRoll `json:"rolls,omitempty"`

	Suggestions *Suggestions `json:"suggestions,omitempty"`

	Summary *MarkdownString `json:"summary,omitempty"`

	Template *OracleRollTemplate `json:"template,omitempty"`
}

type OracleTableRowID = string

type OracleTableStyle string

const (
	OracleTableStyleEmbedAsColumn OracleTableStyle = "embed_as_column"

	OracleTableStyleEmbedInRow OracleTableStyle = "embed_in_row"

	OracleTableStyleTable OracleTableStyle = "table"
)

// A standard player stat, or a condition meter that can be used as a stat in an
// action roll.
type PlayerAttributeRollable string

const (
	PlayerAttributeRollableEdge PlayerAttributeRollable = "edge"

	PlayerAttributeRollableHealth PlayerAttributeRollable = "health"

	PlayerAttributeRollableHeart PlayerAttributeRollable = "heart"

	PlayerAttributeRollableIron PlayerAttributeRollable = "iron"

	PlayerAttributeRollableShadow PlayerAttributeRollable = "shadow"

	PlayerAttributeRollableSpirit PlayerAttributeRollable = "spirit"

	PlayerAttributeRollableSupply PlayerAttributeRollable = "supply"

	PlayerAttributeRollableWits PlayerAttributeRollable = "wits"
)

// A standard player character condition meter.
type PlayerConditionMeter string

const (
	PlayerConditionMeterHealth PlayerConditionMeter = "health"

	PlayerConditionMeterSpirit PlayerConditionMeter = "spirit"

	PlayerConditionMeterSupply PlayerConditionMeter = "supply"
)

// A standard player character stat.
type PlayerStat string

const (
	PlayerStatEdge PlayerStat = "edge"

	PlayerStatHeart PlayerStat = "heart"

	PlayerStatIron PlayerStat = "iron"

	PlayerStatShadow PlayerStat = "shadow"

	PlayerStatWits PlayerStat = "wits"
)

type ProgressType string

const (
// A player's Bonds legacy track(Starforged ruleset only)
	ProgressTypeBondsLegacy ProgressType = "bonds_legacy"

// A player's bonds progress track (Ironsworn ruleset only)
	ProgressTypeBondsProgress ProgressType = "bonds_progress"

// A combat progress track, started with Enter the Fray.
	ProgressTypeCombatProgress ProgressType = "combat_progress"

// A connection progress track, started with Make a Connection (Starforged
// ruleset only)
	ProgressTypeConnectionProgress ProgressType = "connection_progress"

// A delve site progress track, started with Discover a Site (Ironsworn ruleset
// only)
	ProgressTypeDelveProgress ProgressType = "delve_progress"

// A player's Discoveries legacy track(Starforged ruleset only)
	ProgressTypeDiscoveriesLegacy ProgressType = "discoveries_legacy"

// An expedition progress track, started with Undertake an Expedition
// (Starforged ruleset only)
	ProgressTypeExpeditionProgress ProgressType = "expedition_progress"

// A journey progress track, started with Undertake a Journey (Ironsworn ruleset
// only)
	ProgressTypeJourneyProgress ProgressType = "journey_progress"

// A player's Quests legacy track (Starforged ruleset only)
	ProgressTypeQuestsLegacy ProgressType = "quests_legacy"

// A scene challenge progress track.
	ProgressTypeSceneChallengeProgress ProgressType = "scene_challenge_progress"

// A vow progress track, started with Swear an Iron Vow.
	ProgressTypeVowProgress ProgressType = "vow_progress"
)

type Rarity struct {
	Asset AssetID `json:"asset"`

	Description MarkdownString `json:"description"`

	ID RarityID `json:"id"`

	Name Label `json:"name"`

	Source Source `json:"source"`

	XpCost uint8 `json:"xp_cost"`

	Icon *SvgImageURL `json:"icon,omitempty"`

	Suggestions *Suggestions `json:"suggestions,omitempty"`
}

type RarityID = string

type RegionEntry struct {
	Description MarkdownString `json:"description"`

	Features []MarkdownString `json:"features"`

	ID RegionEntryID `json:"id"`

	Name Label `json:"name"`

	QuestStarter MarkdownString `json:"quest_starter"`

	Source Source `json:"source"`

	Summary MarkdownString `json:"summary"`

	Suggestions *Suggestions `json:"suggestions,omitempty"`
}

type RegionEntryID = string

type RegularExpression = string

type SettingTruth struct {
	ID SettingTruthID `json:"id"`

	Name Label `json:"name"`

	Options []SettingTruthOption `json:"options"`

	Source Source `json:"source"`

	Icon *SvgImageURL `json:"icon,omitempty"`

	Suggestions *Suggestions `json:"suggestions,omitempty"`
}

type SettingTruthID = string

type SettingTruthOption struct {
	Description MarkdownString `json:"description"`

	ID SettingTruthOptionID `json:"id"`

	QuestStarter MarkdownString `json:"quest_starter"`

	Summary MarkdownString `json:"summary"`
}

type SettingTruthOptionID = string

type Source struct {
	Authors []string `json:"authors"`

	Date time.Time `json:"date"`

	License URL `json:"license"`

	Title string `json:"title"`

	URL URL `json:"url"`

	Page *uint16 `json:"page,omitempty"`
}

// A player stat (e.g. `player/stats/edge`), a player condition meter (e.g.
// `player/meters/health`), or an ID pointing to an asset option or asset
// control whose value is to be used.
type StatID = string

type Suggestions struct {
	Assets []AssetID `json:"assets,omitempty"`

	Moves []MoveID `json:"moves,omitempty"`

	Oracles []OracleTableID `json:"oracles,omitempty"`
}

// A relative URL pointing to an SVG image.
type SvgImageURL = string

// A rich text string in Markdown with replaced values from oracle roll results.
// 
//       The custom syntax `{{some_row_key:some_oracle_table_id}}`
// should be replaced by the `some_row_key` string of a rolled
// oracle table. This is usually the `result` key, for example
// `{{result:starforged/oracles/core/action}}`
type TemplateString = string

// Describes a move's trigger condition(s) and any rolls associated with them.
type Trigger struct {
	RollType string

	ActionRoll TriggerActionRoll

	ProgressRoll TriggerProgressRoll
}

func (v Trigger) MarshalJSON() ([]byte, error) {
	switch v.RollType {
	case "action_roll":
		return json.Marshal(struct { T string `json:"roll_type"`; TriggerActionRoll }{ v.RollType, v.ActionRoll })
	case "progress_roll":
		return json.Marshal(struct { T string `json:"roll_type"`; TriggerProgressRoll }{ v.RollType, v.ProgressRoll })
	}

	return nil, fmt.Errorf("bad RollType value: %s", v.RollType)
}

func (v *Trigger) UnmarshalJSON(b []byte) error {
	var t struct { T string `json:"roll_type"` }
	if err := json.Unmarshal(b, &t); err != nil {
		return err
	}

	var err error
	switch t.T {
	case "action_roll":
		err = json.Unmarshal(b, &v.ActionRoll)
	case "progress_roll":
		err = json.Unmarshal(b, &v.ProgressRoll)
	default:
		err = fmt.Errorf("bad RollType value: %s", t.T)
	}

	if err != nil {
		return err
	}

	v.RollType = t.T
	return nil
}

type TriggerActionRoll struct {
	// Text describing the primary trigger condition of the move. Any trigger
	// options are assumed to meet this condition in addition to their own trigger
	// conditions.
	Text MarkdownString `json:"text"`

	RollOptions []TriggerRollOptionAction `json:"roll_options,omitempty"`
}

type TriggerProgressRoll struct {
	// Text describing the primary trigger condition of the move. Any trigger
	// options are assumed to meet this condition in addition to their own trigger
	// conditions.
	Text MarkdownString `json:"text"`

	RollOptions []TriggerRollOptionProgress `json:"roll_options,omitempty"`
}

// Information on who can trigger this trigger option. Usually this is just the
// player, but some asset abilities can trigger from an ally's move.
type TriggerBy struct {
	Ally bool `json:"ally"`

	Player bool `json:"player"`
}

// Extends or upgrades an existing move trigger.
type TriggerExtension struct {
	RollType string

	ActionRoll TriggerExtensionActionRoll

	ProgressRoll TriggerExtensionProgressRoll
}

func (v TriggerExtension) MarshalJSON() ([]byte, error) {
	switch v.RollType {
	case "action_roll":
		return json.Marshal(struct { T string `json:"roll_type"`; TriggerExtensionActionRoll }{ v.RollType, v.ActionRoll })
	case "progress_roll":
		return json.Marshal(struct { T string `json:"roll_type"`; TriggerExtensionProgressRoll }{ v.RollType, v.ProgressRoll })
	}

	return nil, fmt.Errorf("bad RollType value: %s", v.RollType)
}

func (v *TriggerExtension) UnmarshalJSON(b []byte) error {
	var t struct { T string `json:"roll_type"` }
	if err := json.Unmarshal(b, &t); err != nil {
		return err
	}

	var err error
	switch t.T {
	case "action_roll":
		err = json.Unmarshal(b, &v.ActionRoll)
	case "progress_roll":
		err = json.Unmarshal(b, &v.ProgressRoll)
	default:
		err = fmt.Errorf("bad RollType value: %s", t.T)
	}

	if err != nil {
		return err
	}

	v.RollType = t.T
	return nil
}

// Extends or upgrades an existing action roll trigger.
type TriggerExtensionActionRoll struct {
	RollOptions []TriggerRollOptionAction `json:"roll_options"`
}

// Extends or upgrades an existing action roll trigger.
type TriggerExtensionProgressRoll struct {
	RollOptions []TriggerRollOptionProgress `json:"roll_options"`
}

type TriggerRollOptionAction struct {
	Method *MoveRollMethod `json:"method"`

	By *TriggerBy `json:"by,omitempty"`

	Choices []TriggerRollOptionActionChoice `json:"choices,omitempty"`

	// Describes any additional trigger conditions for this trigger option
	Text *MarkdownString `json:"text,omitempty"`
}

type TriggerRollOptionActionChoice struct {
	Using string

	CustomValue TriggerRollOptionActionChoiceCustomValue

	Edge TriggerRollOptionActionChoiceEdge

	Health TriggerRollOptionActionChoiceHealth

	Heart TriggerRollOptionActionChoiceHeart

	Iron TriggerRollOptionActionChoiceIron

	Ref TriggerRollOptionActionChoiceRef

	Shadow TriggerRollOptionActionChoiceShadow

	Spirit TriggerRollOptionActionChoiceSpirit

	Supply TriggerRollOptionActionChoiceSupply

	Wits TriggerRollOptionActionChoiceWits
}

func (v TriggerRollOptionActionChoice) MarshalJSON() ([]byte, error) {
	switch v.Using {
	case "custom_value":
		return json.Marshal(struct { T string `json:"using"`; TriggerRollOptionActionChoiceCustomValue }{ v.Using, v.CustomValue })
	case "edge":
		return json.Marshal(struct { T string `json:"using"`; TriggerRollOptionActionChoiceEdge }{ v.Using, v.Edge })
	case "health":
		return json.Marshal(struct { T string `json:"using"`; TriggerRollOptionActionChoiceHealth }{ v.Using, v.Health })
	case "heart":
		return json.Marshal(struct { T string `json:"using"`; TriggerRollOptionActionChoiceHeart }{ v.Using, v.Heart })
	case "iron":
		return json.Marshal(struct { T string `json:"using"`; TriggerRollOptionActionChoiceIron }{ v.Using, v.Iron })
	case "ref":
		return json.Marshal(struct { T string `json:"using"`; TriggerRollOptionActionChoiceRef }{ v.Using, v.Ref })
	case "shadow":
		return json.Marshal(struct { T string `json:"using"`; TriggerRollOptionActionChoiceShadow }{ v.Using, v.Shadow })
	case "spirit":
		return json.Marshal(struct { T string `json:"using"`; TriggerRollOptionActionChoiceSpirit }{ v.Using, v.Spirit })
	case "supply":
		return json.Marshal(struct { T string `json:"using"`; TriggerRollOptionActionChoiceSupply }{ v.Using, v.Supply })
	case "wits":
		return json.Marshal(struct { T string `json:"using"`; TriggerRollOptionActionChoiceWits }{ v.Using, v.Wits })
	}

	return nil, fmt.Errorf("bad Using value: %s", v.Using)
}

func (v *TriggerRollOptionActionChoice) UnmarshalJSON(b []byte) error {
	var t struct { T string `json:"using"` }
	if err := json.Unmarshal(b, &t); err != nil {
		return err
	}

	var err error
	switch t.T {
	case "custom_value":
		err = json.Unmarshal(b, &v.CustomValue)
	case "edge":
		err = json.Unmarshal(b, &v.Edge)
	case "health":
		err = json.Unmarshal(b, &v.Health)
	case "heart":
		err = json.Unmarshal(b, &v.Heart)
	case "iron":
		err = json.Unmarshal(b, &v.Iron)
	case "ref":
		err = json.Unmarshal(b, &v.Ref)
	case "shadow":
		err = json.Unmarshal(b, &v.Shadow)
	case "spirit":
		err = json.Unmarshal(b, &v.Spirit)
	case "supply":
		err = json.Unmarshal(b, &v.Supply)
	case "wits":
		err = json.Unmarshal(b, &v.Wits)
	default:
		err = fmt.Errorf("bad Using value: %s", t.T)
	}

	if err != nil {
		return err
	}

	v.Using = t.T
	return nil
}

type TriggerRollOptionActionChoiceCustomValue struct {
	Label Label `json:"label"`

	Value int8 `json:"value"`
}

type TriggerRollOptionActionChoiceEdge struct {
}

type TriggerRollOptionActionChoiceHealth struct {
}

type TriggerRollOptionActionChoiceHeart struct {
}

type TriggerRollOptionActionChoiceIron struct {
}

type TriggerRollOptionActionChoiceRef struct {
	Ref string `json:"ref"`
}

type TriggerRollOptionActionChoiceShadow struct {
}

type TriggerRollOptionActionChoiceSpirit struct {
}

type TriggerRollOptionActionChoiceSupply struct {
}

type TriggerRollOptionActionChoiceWits struct {
}

type TriggerRollOptionProgress struct {
	Method *MoveRollMethod `json:"method"`

	By *TriggerBy `json:"by,omitempty"`

	Choices []TriggerRollOptionProgressChoice `json:"choices,omitempty"`

	// Describes any additional trigger conditions for this trigger option
	Text *MarkdownString `json:"text,omitempty"`
}

type TriggerRollOptionProgressChoice struct {
	Using ProgressType `json:"using"`
}

// An absolute URL pointing to a web site.
type URL = string

// A relative URL pointing to a WEBP image.
type WebpImageURL = string

type WorldTruth struct {
	ID WorldTruthID `json:"id"`

	Name Label `json:"name"`

	Options []WorldTruthOption `json:"options"`

	Source Source `json:"source"`

	Icon *SvgImageURL `json:"icon,omitempty"`

	Suggestions *Suggestions `json:"suggestions,omitempty"`
}

type WorldTruthID = string

type WorldTruthOption struct {
	Description MarkdownString `json:"description"`

	ID WorldTruthOptionID `json:"id"`

	QuestStarter MarkdownString `json:"quest_starter"`
}

type WorldTruthOptionID = string