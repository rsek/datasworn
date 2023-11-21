// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.util.List;

@JsonSerialize
public class TriggerNoRoll {
    @JsonProperty("text")
    private MarkdownString text;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("conditions")
    private List<TriggerNoRollCondition> conditions;

    public TriggerNoRoll() {
    }

    /**
     * Getter for text.<p>
     * A markdown string of the primary trigger text for this move.
     * 
     * Secondary trigger text (for specific stats or uses of an asset ability)
     * may be available for individual trigger conditions.
     */
    public MarkdownString getText() {
        return text;
    }

    /**
     * Setter for text.<p>
     * A markdown string of the primary trigger text for this move.
     * 
     * Secondary trigger text (for specific stats or uses of an asset ability)
     * may be available for individual trigger conditions.
     */
    public void setText(MarkdownString text) {
        this.text = text;
    }

    /**
     * Getter for conditions.<p>
     */
    public List<TriggerNoRollCondition> getConditions() {
        return conditions;
    }

    /**
     * Setter for conditions.<p>
     */
    public void setConditions(List<TriggerNoRollCondition> conditions) {
        this.conditions = conditions;
    }
}
