// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * A wildcarded AssetId that can be used to match multiple Asset objects.
 */
public class AssetIdWildcard {
    @JsonValue
    private String value;

    public AssetIdWildcard() {
    }

    @JsonCreator
    public AssetIdWildcard(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
