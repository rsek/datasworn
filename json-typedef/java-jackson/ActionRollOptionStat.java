// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize
public class ActionRollOptionStat extends ActionRollOption {
    @JsonProperty("stat")
    private PlayerStat stat;

    public ActionRollOptionStat() {
    }

    /**
     * Getter for stat.<p>
     */
    public PlayerStat getStat() {
        return stat;
    }

    /**
     * Setter for stat.<p>
     */
    public void setStat(PlayerStat stat) {
        this.stat = stat;
    }
}