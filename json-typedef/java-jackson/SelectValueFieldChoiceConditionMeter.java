// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

/**
 * Represents an option in a list of choices.
 */
@JsonSerialize
public class SelectValueFieldChoiceConditionMeter extends SelectValueFieldChoice {
    @JsonProperty("choice_type")
    private SelectValueFieldChoiceConditionMeterChoiceType choiceType;

    @JsonProperty("condition_meter")
    private ConditionMeterKey conditionMeter;

    @JsonProperty("label")
    private InputLabel label;

    public SelectValueFieldChoiceConditionMeter() {
    }

    /**
     * Getter for choiceType.<p>
     */
    public SelectValueFieldChoiceConditionMeterChoiceType getChoiceType() {
        return choiceType;
    }

    /**
     * Setter for choiceType.<p>
     */
    public void setChoiceType(SelectValueFieldChoiceConditionMeterChoiceType choiceType) {
        this.choiceType = choiceType;
    }

    /**
     * Getter for conditionMeter.<p>
     */
    public ConditionMeterKey getConditionMeter() {
        return conditionMeter;
    }

    /**
     * Setter for conditionMeter.<p>
     */
    public void setConditionMeter(ConditionMeterKey conditionMeter) {
        this.conditionMeter = conditionMeter;
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
