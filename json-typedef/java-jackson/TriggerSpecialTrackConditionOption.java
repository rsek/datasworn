// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize
public class TriggerSpecialTrackConditionOption {
    @JsonProperty("using")
    private SpecialTrackType using;

    public TriggerSpecialTrackConditionOption() {
    }

    /**
     * Getter for using.<p>
     */
    public SpecialTrackType getUsing() {
        return using;
    }

    /**
     * Setter for using.<p>
     */
    public void setUsing(SpecialTrackType using) {
        this.using = using;
    }
}
