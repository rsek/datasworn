// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

/**
 * A reference to the value of an attached asset control. For example, a Module
 * asset could use this to roll using the `integrity` control of an attached
 * Vehicle.
 */
@JsonSerialize
public class RollableValueAttachedAssetControl extends RollableValue {
    @JsonProperty("control")
    private DictKey control;

    public RollableValueAttachedAssetControl() {
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
}
