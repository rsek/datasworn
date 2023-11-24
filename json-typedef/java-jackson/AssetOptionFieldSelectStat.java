// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.util.Map;

/**
 * Represents a list of mutually exclusive choices.
 */
@JsonSerialize
public class AssetOptionFieldSelectStat extends AssetOptionField {
    @JsonProperty("choices")
    private Map<String, AssetOptionFieldSelectStatChoice> choices;

    @JsonProperty("id")
    private AssetOptionFieldId id;

    @JsonProperty("name")
    private Label name;

    @JsonProperty("value")
    private DictKey value;

    public AssetOptionFieldSelectStat() {
    }

    /**
     * Getter for choices.<p>
     */
    public Map<String, AssetOptionFieldSelectStatChoice> getChoices() {
        return choices;
    }

    /**
     * Setter for choices.<p>
     */
    public void setChoices(Map<String, AssetOptionFieldSelectStatChoice> choices) {
        this.choices = choices;
    }

    /**
     * Getter for id.<p>
     */
    public AssetOptionFieldId getId() {
        return id;
    }

    /**
     * Setter for id.<p>
     */
    public void setId(AssetOptionFieldId id) {
        this.id = id;
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
     * Getter for value.<p>
     * The key of the currently selected choice from the `choices` property, or
     * `null` if none is selected.
     */
    public DictKey getValue() {
        return value;
    }

    /**
     * Setter for value.<p>
     * The key of the currently selected choice from the `choices` property, or
     * `null` if none is selected.
     */
    public void setValue(DictKey value) {
        this.value = value;
    }
}