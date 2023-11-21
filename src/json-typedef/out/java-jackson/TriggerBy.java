// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

/**
 * Information on who can trigger this trigger condition. Usually this is just
 * the player, but some asset abilities can trigger from an ally's move.
 */
@JsonSerialize
public class TriggerBy {
    @JsonProperty("ally")
    private Boolean ally;

    @JsonProperty("player")
    private Boolean player;

    public TriggerBy() {
    }

    /**
     * Getter for ally.<p>
     */
    public Boolean getAlly() {
        return ally;
    }

    /**
     * Setter for ally.<p>
     */
    public void setAlly(Boolean ally) {
        this.ally = ally;
    }

    /**
     * Getter for player.<p>
     */
    public Boolean getPlayer() {
        return player;
    }

    /**
     * Setter for player.<p>
     */
    public void setPlayer(Boolean player) {
        this.player = player;
    }
}
