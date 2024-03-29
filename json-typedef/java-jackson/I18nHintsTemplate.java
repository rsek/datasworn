// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize
public class I18nHintsTemplate {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("description")
    private I18nHint description;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("detail")
    private I18nHint detail;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("result")
    private I18nHint result;

    public I18nHintsTemplate() {
    }

    /**
     * Getter for description.<p>
     */
    public I18nHint getDescription() {
        return description;
    }

    /**
     * Setter for description.<p>
     */
    public void setDescription(I18nHint description) {
        this.description = description;
    }

    /**
     * Getter for detail.<p>
     */
    public I18nHint getDetail() {
        return detail;
    }

    /**
     * Setter for detail.<p>
     */
    public void setDetail(I18nHint detail) {
        this.detail = detail;
    }

    /**
     * Getter for result.<p>
     */
    public I18nHint getResult() {
        return result;
    }

    /**
     * Setter for result.<p>
     */
    public void setResult(I18nHint result) {
        this.result = result;
    }
}
