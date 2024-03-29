// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * A unique ID for an AssetCollection.
 */
public class AssetCollectionId {
    @JsonValue
    private String value;

    public AssetCollectionId() {
    }

    @JsonCreator
    public AssetCollectionId(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
