// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "field_type")
@JsonSubTypes({
    @JsonSubTypes.Type(name = "checkbox", value = AssetAbilityControlFieldCheckbox.class),
    @JsonSubTypes.Type(name = "clock", value = AssetAbilityControlFieldClock.class),
    @JsonSubTypes.Type(name = "counter", value = AssetAbilityControlFieldCounter.class),
})
public abstract class AssetAbilityControlField {
}
