// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

/**
 * The label at the head of each table column. The `roll` key refers to the roll
 * column showing the dice range (`min` and `max` on each table row).
 */
@JsonSerialize
public class OracleColumnSimpleColumnLabels {
    @JsonProperty("result")
    private Label result;

    @JsonProperty("roll")
    private Label roll;

    public OracleColumnSimpleColumnLabels() {
    }

    /**
     * Getter for result.<p>
     */
    public Label getResult() {
        return result;
    }

    /**
     * Setter for result.<p>
     */
    public void setResult(Label result) {
        this.result = result;
    }

    /**
     * Getter for roll.<p>
     */
    public Label getRoll() {
        return roll;
    }

    /**
     * Setter for roll.<p>
     */
    public void setRoll(Label roll) {
        this.roll = roll;
    }
}
