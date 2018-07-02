sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	
	return Controller.extend("de.sachsen.sab.antrdatpruf.controller.BaseController", {
		
		getRouter : function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onNavBack: function (oEvent) {
			let oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
                this.getRouter().navTo("antragsDatenErfassung", {}, true /*no history*/);
			}
		},

		getModel : function(name) {
			return this.getView().getModel(name) || this.getOwnerComponent().getModel(name);
		},

        /**
         * Getter for the resource bundle.
         * @public
         * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
         */
        getResourceBundle: function() {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },
	});
});