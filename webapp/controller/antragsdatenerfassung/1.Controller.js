sap.ui.define([
    "de/sachsen/sab/antrdatpruf/controller/BaseController"
], function (BaseController) {

    return BaseController.extend("de.sachsen.sab.antrdatpruf.controller.antragsdatenerfassung.1", {

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */
        onInit: function () {
            this._initGeschaeftsVPModel();
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /**
         * onOK click event handler
         */
        onOK: function() {
            //dialog abfrage ob ok
            //daten speichern
            //prozess weiter
            //task status = bearbeiten
            //task aus postkorb
        },

        /**
         * onAbbruch click event handler
         */
        onAbbruch: function() {
            this.getRouter().navTo("antragsDatenErfassung");
        },

        /**
         * send email action static showcase
         * //TODO GP ANBINDUNG
         *
         */
        onSendGPMail: function () {
            sap.m.URLHelper.triggerEmail("gpmail@some-mail.com", "SAB-Subject", "Hallo GP, \n  wir benötigen zusaetzlich noch die Formulare XYZ, AYZ, ZZZ und BCA. \nGruezli");
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * set models on the view for the GP and Kunde
         * TODO GP anbindung
         */
        _initGeschaeftsVPModel: function () {
            let oModel = new sap.ui.model.json.JSONModel({
                "AntragsStatus": {
                    "type": "String",
                    "value": "Offen",
                    "valueInfo": {}
                },
                "DatumAntragserfassung": {
                    "type": "String",
                    "value": "08.05.2018",
                    "valueInfo": {}
                },
                "ProduktName": {
                    "type": "String",
                    "value": "ProduktnameXY",
                    "valueInfo": {}
                }
            });
            this.getView().setModel(oModel, "modelGeschVorfall");
            let oModelGP = new sap.ui.model.json.JSONModel({
                "GeschaeftspartnerNr": {
                    "type": "String",
                    "value": "2002102718",
                    "valueInfo": {}
                },
                "Telefonnummer": {
                    "type": "String",
                    "value": "+4935955779750",
                    "valueInfo": {}
                },
                "NameVorname": {
                    "type": "String",
                    "value": "Daniela Hirschberg",
                    "valueInfo": {}
                }
            });
            this.getView().setModel(oModelGP, "modelGPKunde");
        },
    });
});