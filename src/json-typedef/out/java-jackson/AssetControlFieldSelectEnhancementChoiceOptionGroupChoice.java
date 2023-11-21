// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

/**
 * Represents an option in a list of choices.
 */
@JsonSerialize
public class AssetControlFieldSelectEnhancementChoiceOptionGroupChoice {
    @JsonProperty("name")
    private Label name;

    @JsonProperty("option_type")
    private AssetControlFieldSelectEnhancementChoiceOptionGroupChoiceOptionType optionType;

    @JsonProperty("value")
    private AssetControlFieldSelectEnhancementChoiceOptionGroupChoiceValue value;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("selected")
    private Boolean selected;

    public AssetControlFieldSelectEnhancementChoiceOptionGroupChoice() {
    }

    /**
     * Getter for name.<p>
     * A label for this input. In some contexts it may be undesirable to render
     * this text, but it should always be exposed to assistive technology (e.g.
     * with `aria-label` in HTML).
     */
    public Label getName() {
        return name;
    }

    /**
     * Setter for name.<p>
     * A label for this input. In some contexts it may be undesirable to render
     * this text, but it should always be exposed to assistive technology (e.g.
     * with `aria-label` in HTML).
     */
    public void setName(Label name) {
        this.name = name;
    }

    /**
     * Getter for optionType.<p>
     */
    public AssetControlFieldSelectEnhancementChoiceOptionGroupChoiceOptionType getOptionType() {
        return optionType;
    }

    /**
     * Setter for optionType.<p>
     */
    public void setOptionType(AssetControlFieldSelectEnhancementChoiceOptionGroupChoiceOptionType optionType) {
        this.optionType = optionType;
    }

    /**
     * Getter for value.<p>
     * The current value of this input.
     */
    public AssetControlFieldSelectEnhancementChoiceOptionGroupChoiceValue getValue() {
        return value;
    }

    /**
     * Setter for value.<p>
     * The current value of this input.
     */
    public void setValue(AssetControlFieldSelectEnhancementChoiceOptionGroupChoiceValue value) {
        this.value = value;
    }

    /**
     * Getter for selected.<p>
     * Is this option currently selected?
     */
    public Boolean getSelected() {
        return selected;
    }

    /**
     * Setter for selected.<p>
     * Is this option currently selected?
     */
    public void setSelected(Boolean selected) {
        this.selected = selected;
    }
}
