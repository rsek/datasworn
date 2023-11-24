// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize
public class ActionRollOptionAttachedAssetControl extends ActionRollOption {
    @JsonProperty("control")
    private DictKey control;

    public ActionRollOptionAttachedAssetControl() {
    }

    /**
     * Getter for control.<p>
     * The key of the asset control field.
     */
    public DictKey getControl() {
        return control;
    }

    /**
     * Setter for control.<p>
     * The key of the asset control field.
     */
    public void setControl(DictKey control) {
        this.control = control;
    }
}