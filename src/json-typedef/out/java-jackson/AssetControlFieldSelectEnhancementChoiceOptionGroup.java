// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.util.Map;

/**
 * Represents a grouping of options in a list of choices.
 */
@JsonSerialize
public class AssetControlFieldSelectEnhancementChoiceOptionGroup extends AssetControlFieldSelectEnhancementChoice {
    @JsonProperty("choices")
    private Map<String, AssetControlFieldSelectEnhancementChoiceOptionGroupChoice> choices;

    @JsonProperty("name")
    private Label name;

    public AssetControlFieldSelectEnhancementChoiceOptionGroup() {
    }

    /**
     * Getter for choices.<p>
     */
    public Map<String, AssetControlFieldSelectEnhancementChoiceOptionGroupChoice> getChoices() {
        return choices;
    }

    /**
     * Setter for choices.<p>
     */
    public void setChoices(Map<String, AssetControlFieldSelectEnhancementChoiceOptionGroupChoice> choices) {
        this.choices = choices;
    }

    /**
     * Getter for name.<p>
     * A label for this option group.
     */
    public Label getName() {
        return name;
    }

    /**
     * Setter for name.<p>
     * A label for this option group.
     */
    public void setName(Label name) {
        this.name = name;
    }
}
