// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Normally, rows will end with two numbers separated by a dash, indicating
 * their dice range.
 * 
 * Rows with a single number represent unrollable rows that are sometimes
 * included for rendering purposes; in this case, the number represents the
 * row's index.
 */
public class OracleTableRowId {
    @JsonValue
    private String value;

    public OracleTableRowId() {
    }

    @JsonCreator
    public OracleTableRowId(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
