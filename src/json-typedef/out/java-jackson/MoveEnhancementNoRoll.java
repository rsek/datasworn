// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.util.List;

@JsonSerialize
public class MoveEnhancementNoRoll extends MoveEnhancement {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("enhances")
    private List<MoveIdwildcard> enhances;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("trigger")
    private MoveEnhancementNoRollTrigger trigger;

    public MoveEnhancementNoRoll() {
    }

    /**
     * Getter for enhances.<p>
     */
    public List<MoveIdwildcard> getEnhances() {
        return enhances;
    }

    /**
     * Setter for enhances.<p>
     */
    public void setEnhances(List<MoveIdwildcard> enhances) {
        this.enhances = enhances;
    }

    /**
     * Getter for trigger.<p>
     */
    public MoveEnhancementNoRollTrigger getTrigger() {
        return trigger;
    }

    /**
     * Setter for trigger.<p>
     */
    public void setTrigger(MoveEnhancementNoRollTrigger trigger) {
        this.trigger = trigger;
    }
}
