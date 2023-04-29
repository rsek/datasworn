// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Dataforged;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * A move ID, for a standard move or a unique asset move
 */
public class MoveId {
    @JsonValue
    private String value;

    public MoveId() {
    }

    @JsonCreator
    public MoveId(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
