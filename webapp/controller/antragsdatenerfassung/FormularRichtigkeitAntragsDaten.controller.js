sap.ui.define([
        "de/sachsen/sab/antrdatpruf/controller/antragsdatenerfassung/BaseFormularController"
    ], function (BaseFormularController) {


        return BaseFormularController.extend("de.sachsen.sab.antrdatpruf.controller.antragsdatenerfassung.FormularRichtigkeitAntragsDaten", {
            onInit: function() {
                this.getRouter().attachRouteMatched(this.handleRouteMatched, this);
                this.initErrMsgPopover(this.getView());
                this._setErrorInputs(this.getView());
            }
        });
    }
);
