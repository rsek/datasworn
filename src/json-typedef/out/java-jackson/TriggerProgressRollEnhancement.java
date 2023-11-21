// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.util.List;

@JsonSerialize
public class TriggerProgressRollEnhancement {
    @JsonProperty("conditions")
    private List<TriggerProgressRollConditionEnhancement> conditions;

    public TriggerProgressRollEnhancement() {
    }

    /**
     * Getter for conditions.<p>
     */
    public List<TriggerProgressRollConditionEnhancement> getConditions() {
        return conditions;
    }

    /**
     * Setter for conditions.<p>
     */
    public void setConditions(List<TriggerProgressRollConditionEnhancement> conditions) {
        this.conditions = conditions;
    }
}
