sap.ui.define([], function () {
	"use strict";
	return {
        dateTimeShort: function(sValue) {
            console.log("FORMATTER VALUE: ", sValue);
            if (!sValue) {
                return "";
            }
            console.log("FORMATTER VALUE: ", sValue);
            let date = new Date(sValue);
            let sapUi5Date = new sap.ui.model.type.Date({
                style: 'short'
            });
            return sapUi5Date.formatValue(date, "string");
        }
	};
});