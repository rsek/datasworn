// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

/**
 * Represents an option in a list of choices.
 */
@JsonSerialize
public class SelectValueFieldChoiceAttachedAssetControl extends SelectValueFieldChoice {
    @JsonProperty("choice_type")
    private SelectValueFieldChoiceAttachedAssetControlChoiceType choiceType;

    @JsonProperty("control")
    private DictKey control;

    @JsonProperty("label")
    private InputLabel label;

    public SelectValueFieldChoiceAttachedAssetControl() {
    }

    /**
     * Getter for choiceType.<p>
     */
    public SelectValueFieldChoiceAttachedAssetControlChoiceType getChoiceType() {
        return choiceType;
    }

    /**
     * Setter for choiceType.<p>
     */
    public void setChoiceType(SelectValueFieldChoiceAttachedAssetControlChoiceType choiceType) {
        this.choiceType = choiceType;
    }

    /**
     * Getter for control.<p>
     * The dictionary key of the asset control field.
     */
    public DictKey getControl() {
        return control;
    }

    /**
     * Setter for control.<p>
     * The dictionary key of the asset control field.
     */
    public void setControl(DictKey control) {
        this.control = control;
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
}
