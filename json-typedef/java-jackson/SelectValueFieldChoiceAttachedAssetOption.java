// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

/**
 * Represents an option in a list of choices.
 */
@JsonSerialize
public class SelectValueFieldChoiceAttachedAssetOption extends SelectValueFieldChoice {
    @JsonProperty("choice_type")
    private SelectValueFieldChoiceAttachedAssetOptionChoiceType choiceType;

    @JsonProperty("label")
    private InputLabel label;

    @JsonProperty("option")
    private DictKey option;

    public SelectValueFieldChoiceAttachedAssetOption() {
    }

    /**
     * Getter for choiceType.<p>
     */
    public SelectValueFieldChoiceAttachedAssetOptionChoiceType getChoiceType() {
        return choiceType;
    }

    /**
     * Setter for choiceType.<p>
     */
    public void setChoiceType(SelectValueFieldChoiceAttachedAssetOptionChoiceType choiceType) {
        this.choiceType = choiceType;
    }

    /**
     * Getter for label.<p>
     */
    public InputLabel getLabel() {
        return label;
    }

    /**
     * Setter for label.<p>
     */
    public void setLabel(InputLabel label) {
        this.label = label;
    }

    /**
     * Getter for option.<p>
     * The dictionary key of the asset option field.
     */
    public DictKey getOption() {
        return option;
    }

    /**
     * Setter for option.<p>
     * The dictionary key of the asset option field.
     */
    public void setOption(DictKey option) {
        this.option = option;
    }
}
