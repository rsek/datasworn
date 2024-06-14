// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "roll_type")
@JsonSubTypes({
    @JsonSubTypes.Type(name = "action_roll", value = EmbeddedMoveActionRoll.class),
    @JsonSubTypes.Type(name = "no_roll", value = EmbeddedMoveNoRoll.class),
    @JsonSubTypes.Type(name = "progress_roll", value = EmbeddedMoveProgressRoll.class),
    @JsonSubTypes.Type(name = "special_track", value = EmbeddedMoveSpecialTrack.class),
})
public abstract class EmbeddedMove {
}