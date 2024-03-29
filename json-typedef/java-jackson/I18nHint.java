// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize
public class I18nHint {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("part_of_speech")
    private PartOfSpeech partOfSpeech;

    public I18nHint() {
    }

    /**
     * Getter for partOfSpeech.<p>
     * The part of speech for this string.
     */
    public PartOfSpeech getPartOfSpeech() {
        return partOfSpeech;
    }

    /**
     * Setter for partOfSpeech.<p>
     * The part of speech for this string.
     */
    public void setPartOfSpeech(PartOfSpeech partOfSpeech) {
        this.partOfSpeech = partOfSpeech;
    }
}
