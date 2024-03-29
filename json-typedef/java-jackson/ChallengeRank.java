// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Challenge rank, represented as an integer from 1 (troublesome) to 5 (epic).
 */
public class ChallengeRank {
    @JsonValue
    private UnsignedByte value;

    public ChallengeRank() {
    }

    @JsonCreator
    public ChallengeRank(UnsignedByte value) {
        this.value = value;
    }

    public UnsignedByte getValue() {
        return value;
    }

    public void setValue(UnsignedByte value) {
        this.value = value;
    }
}
