// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

/**
 * The label at the head of each table column. The `roll` key refers to the roll
 * column showing the dice range (`min` and `max` on each table row).
 */
@JsonSerialize
public class OracleTableRollableTableText3ColumnLabels {
    @JsonProperty("roll")
    private Label roll;

    @JsonProperty("text")
    private Label text;

    @JsonProperty("text2")
    private Label text2;

    @JsonProperty("text3")
    private Label text3;

    public OracleTableRollableTableText3ColumnLabels() {
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

    /**
     * Getter for text.<p>
     */
    public Label getText() {
        return text;
    }

    /**
     * Setter for text.<p>
     */
    public void setText(Label text) {
        this.text = text;
    }

    /**
     * Getter for text2.<p>
     */
    public Label getText2() {
        return text2;
    }

    /**
     * Setter for text2.<p>
     */
    public void setText2(Label text2) {
        this.text2 = text2;
    }

    /**
     * Getter for text3.<p>
     */
    public Label getText3() {
        return text3;
    }

    /**
     * Setter for text3.<p>
     */
    public void setText3(Label text3) {
        this.text3 = text3;
    }
}
