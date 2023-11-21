// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize
public class OracleTableRoll {
    @JsonProperty("times")
    private Short times;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("auto")
    private Boolean auto;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("method")
    private OracleTableRollMethod method;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("oracle")
    private OracleTableId oracle;

    public OracleTableRoll() {
    }

    /**
     * Getter for times.<p>
     */
    public Short getTimes() {
        return times;
    }

    /**
     * Setter for times.<p>
     */
    public void setTimes(Short times) {
        this.times = times;
    }

    /**
     * Getter for auto.<p>
     * The rulebook explicitly cautions *against* rolling all details at once,
     * so rolling every referenced oracle automatically is not recommended.
     * That said, some oracle results only provide useful information once
     * a secondary roll occurs, such as "Action + Theme". If this value is
     * omitted, assume it's false.
     */
    public Boolean getAuto() {
        return auto;
    }

    /**
     * Setter for auto.<p>
     * The rulebook explicitly cautions *against* rolling all details at once,
     * so rolling every referenced oracle automatically is not recommended.
     * That said, some oracle results only provide useful information once
     * a secondary roll occurs, such as "Action + Theme". If this value is
     * omitted, assume it's false.
     */
    public void setAuto(Boolean auto) {
        this.auto = auto;
    }

    /**
     * Getter for method.<p>
     */
    public OracleTableRollMethod getMethod() {
        return method;
    }

    /**
     * Setter for method.<p>
     */
    public void setMethod(OracleTableRollMethod method) {
        this.method = method;
    }

    /**
     * Getter for oracle.<p>
     * The ID of the oracle table to be rolled. If omitted, it defaults to the
     * ID of this oracle table.
     */
    public OracleTableId getOracle() {
        return oracle;
    }

    /**
     * Setter for oracle.<p>
     * The ID of the oracle table to be rolled. If omitted, it defaults to the
     * ID of this oracle table.
     */
    public void setOracle(OracleTableId oracle) {
        this.oracle = oracle;
    }
}
