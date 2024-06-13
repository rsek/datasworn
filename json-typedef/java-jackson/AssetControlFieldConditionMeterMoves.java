// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.util.List;

/**
 * Provides hints for moves that interact with this condition meter, such as
 * suffer and recovery moves.
 */
@JsonSerialize
public class AssetControlFieldConditionMeterMoves {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("recover")
    private List<AnyMoveIdWildcard> recover;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("suffer")
    private List<AnyMoveIdWildcard> suffer;

    public AssetControlFieldConditionMeterMoves() {
    }

    /**
     * Getter for recover.<p>
     * The ID(s) of recovery moves associated with this meter.
     */
    public List<AnyMoveIdWildcard> getRecover() {
        return recover;
    }

    /**
     * Setter for recover.<p>
     * The ID(s) of recovery moves associated with this meter.
     */
    public void setRecover(List<AnyMoveIdWildcard> recover) {
        this.recover = recover;
    }

    /**
     * Getter for suffer.<p>
     * The ID(s) of suffer moves associated with the condition meter. If the
     * suffer move makes an action roll, this condition meter value should be
     * made available as a roll option.
     */
    public List<AnyMoveIdWildcard> getSuffer() {
        return suffer;
    }

    /**
     * Setter for suffer.<p>
     * The ID(s) of suffer moves associated with the condition meter. If the
     * suffer move makes an action roll, this condition meter value should be
     * made available as a roll option.
     */
    public void setSuffer(List<AnyMoveIdWildcard> suffer) {
        this.suffer = suffer;
    }
}
