// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

/**
 * The label at the head of each table column. The `roll` key refers to the roll
 * column showing the dice range (`min` and `max` on each table row).
 */
@JsonSerialize
public class OracleTableSharedText3ColumnLabels {
    @JsonProperty("text")
    private Label text;

    public OracleTableSharedText3ColumnLabels() {
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
}