// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "field_type")
@JsonSubTypes({
    @JsonSubTypes.Type(name = "card_flip", value = AssetControlFieldCardFlip.class),
    @JsonSubTypes.Type(name = "checkbox", value = AssetControlFieldCheckbox.class),
    @JsonSubTypes.Type(name = "condition_meter", value = AssetControlFieldConditionMeter.class),
    @JsonSubTypes.Type(name = "select_enhancement", value = AssetControlFieldSelectEnhancement.class),
})
public abstract class AssetControlField {
}