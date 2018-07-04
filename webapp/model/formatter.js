sap.ui.define([], function () {
	"use strict";
	return {
        dateTimeShort: function(sValue) {
            if (!sValue) {
                return "";
            }
            let date = new Date(sValue);
            let sapUi5Date = new sap.ui.model.type.Date({
                style: 'short'
            });
            return sapUi5Date.formatValue(date,"string");
        }
	};
});