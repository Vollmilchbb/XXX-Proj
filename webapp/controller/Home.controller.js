sap.ui.define([
    "de/sachsen/sab/antrdatpruf/controller/BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
], function (BaseController, MessageToast, JSONModel) {
    "use strict";

    let BBaseController = BaseController.extend("de.sachsen.sab.antrdatpruf.controller.Home", {

        onInit: function () {
            this.getView().byId("processIdInput").setValue("797ca740-58fe-11e8-a14a-0021f6047f5c");
        },

        onNavToAntragsDatenErfassung: function (oEvent) {
            let sProcessId;
            sProcessId = this.getView().byId("processIdInput").getValue();

            if (sProcessId) {
                let oData = {
                    inputPID: sProcessId
                };
                let oModel = new sap.ui.model.json.JSONModel(oData);
                sap.ui.getCore().setModel(oModel, "modelProcessID");
                this.getRouter().navTo("antragsDatenErfassung");
            } else {
                MessageToast.show("Die Prozess-ID darf nicht leer sein.");
            }
        }
    });
    return BBaseController;
});