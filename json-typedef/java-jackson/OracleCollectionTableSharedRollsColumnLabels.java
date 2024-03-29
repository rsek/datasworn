// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

/**
 * Provides column labels for this table. The `roll` key refers to the roll
 * column showing the dice range (`min` and `max` on each table row). For all
 * other column labels, see the `name` property of each child `OracleColumn`.
 */
@JsonSerialize
public class OracleCollectionTableSharedRollsColumnLabels {
    @JsonProperty("roll")
    private Label roll;

    public OracleCollectionTableSharedRollsColumnLabels() {
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
