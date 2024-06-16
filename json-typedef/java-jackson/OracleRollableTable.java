// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "oracle_type")
@JsonSubTypes({
    @JsonSubTypes.Type(name = "table_text", value = OracleRollableTableTableText.class),
    @JsonSubTypes.Type(name = "table_text2", value = OracleRollableTableTableText2.class),
    @JsonSubTypes.Type(name = "table_text3", value = OracleRollableTableTableText3.class),
})
public abstract class OracleRollableTable {
}