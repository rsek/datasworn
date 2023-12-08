// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.util.Map;

/**
 * Some assets provide a special condition meter of their own. The most common
 * example is the health meters on companion assets. Asset condition meters
 * may also include their own controls, such as the checkboxes that Starforged
 * companion assets use to indicate they are "out of action".
 */
@JsonSerialize
public class AssetControlFieldConditionMeter extends AssetControlField {
    @JsonProperty("label")
    private InputLabel label;

    @JsonProperty("max")
    private Byte max;

    @JsonProperty("min")
    private Byte min;

    @JsonProperty("rollable")
    private Boolean rollable;

    @JsonProperty("value")
    private Byte value;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("controls")
    private Map<String, AssetConditionMeterControlField> controls;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("icon")
    private SvgImageUrl icon;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("moves")
    private AssetControlFieldConditionMeterMoves moves;

    public AssetControlFieldConditionMeter() {
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
     * Getter for max.<p>
     * The maximum value of this meter.
     */
    public Byte getMax() {
        return max;
    }

    /**
     * Setter for max.<p>
     * The maximum value of this meter.
     */
    public void setMax(Byte max) {
        this.max = max;
    }

    /**
     * Getter for min.<p>
     * The minimum value of this meter.
     */
    public Byte getMin() {
        return min;
    }

    /**
     * Setter for min.<p>
     * The minimum value of this meter.
     */
    public void setMin(Byte min) {
        this.min = min;
    }

    /**
     * Getter for rollable.<p>
     * Is this meter's `value` usable as a stat in an action roll?
     */
    public Boolean getRollable() {
        return rollable;
    }

    /**
     * Setter for rollable.<p>
     * Is this meter's `value` usable as a stat in an action roll?
     */
    public void setRollable(Boolean rollable) {
        this.rollable = rollable;
    }

    /**
     * Getter for value.<p>
     * The current value of this meter.
     */
    public Byte getValue() {
        return value;
    }

    /**
     * Setter for value.<p>
     * The current value of this meter.
     */
    public void setValue(Byte value) {
        this.value = value;
    }

    /**
     * Getter for controls.<p>
     * Checkbox controls rendered as part of the condition meter.
     */
    public Map<String, AssetConditionMeterControlField> getControls() {
        return controls;
    }

    /**
     * Setter for controls.<p>
     * Checkbox controls rendered as part of the condition meter.
     */
    public void setControls(Map<String, AssetConditionMeterControlField> controls) {
        this.controls = controls;
    }

    /**
     * Getter for icon.<p>
     * An icon associated with this input.
     */
    public SvgImageUrl getIcon() {
        return icon;
    }

    /**
     * Setter for icon.<p>
     * An icon associated with this input.
     */
    public void setIcon(SvgImageUrl icon) {
        this.icon = icon;
    }

    /**
     * Getter for moves.<p>
     * Provides hints for moves that interact with this condition meter, such as
     * suffer and recovery moves.
     */
    public AssetControlFieldConditionMeterMoves getMoves() {
        return moves;
    }

    /**
     * Setter for moves.<p>
     * Provides hints for moves that interact with this condition meter, such as
     * suffer and recovery moves.
     */
    public void setMoves(AssetControlFieldConditionMeterMoves moves) {
        this.moves = moves;
    }
}
