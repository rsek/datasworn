// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize
public class OracleCollectionTableColumn {
    @JsonProperty("content_type")
    private OracleTableColumnContentKey contentType;

    @JsonProperty("table_key")
    private DictKey tableKey;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("color")
    private CssColor color;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("name")
    private Label name;

    public OracleCollectionTableColumn() {
    }

    /**
     * Getter for contentType.<p>
     */
    public OracleTableColumnContentKey getContentType() {
        return contentType;
    }

    /**
     * Setter for contentType.<p>
     */
    public void setContentType(OracleTableColumnContentKey contentType) {
        this.contentType = contentType;
    }

    /**
     * Getter for tableKey.<p>
     * The key of the OracleTable (within this collection), whose data is used
     * to render this column.
     */
    public DictKey getTableKey() {
        return tableKey;
    }

    /**
     * Setter for tableKey.<p>
     * The key of the OracleTable (within this collection), whose data is used
     * to render this column.
     */
    public void setTableKey(DictKey tableKey) {
        this.tableKey = tableKey;
    }

    /**
     * Getter for color.<p>
     * The thematic color for this column.
     */
    public CssColor getColor() {
        return color;
    }

    /**
     * Setter for color.<p>
     * The thematic color for this column.
     */
    public void setColor(CssColor color) {
        this.color = color;
    }

    /**
     * Getter for name.<p>
     * The column's header text.
     */
    public Label getName() {
        return name;
    }

    /**
     * Setter for name.<p>
     * The column's header text.
     */
    public void setName(Label name) {
        this.name = name;
    }
}