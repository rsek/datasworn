// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize
public class EmbeddedOracleRollableColumnTextRecommendedRolls {
    @JsonProperty("max")
    private Short max;

    @JsonProperty("min")
    private Short min;

    public EmbeddedOracleRollableColumnTextRecommendedRolls() {
    }

    /**
     * Getter for max.<p>
     */
    public Short getMax() {
        return max;
    }

    /**
     * Setter for max.<p>
     */
    public void setMax(Short max) {
        this.max = max;
    }

    /**
     * Getter for min.<p>
     */
    public Short getMin() {
        return min;
    }

    /**
     * Setter for min.<p>
     */
    public void setMin(Short min) {
        this.min = min;
    }
}