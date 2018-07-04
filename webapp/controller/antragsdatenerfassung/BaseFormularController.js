sap.ui.define([
    "de/sachsen/sab/antrdatpruf/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "de/sachsen/sab/antrdatpruf/generated/rest-api-bundle",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "de/sachsen/sab/antrdatpruf/controller/util/Validator",
    "sap/m/MessageStrip",
    "de/sachsen/sab/antrdatpruf/controller/util/FehlendeDocsUtil"

], function (BaseController, JSONModel, camundajs, MessageBox, MessageToast, Validator, MessageStrip, FehlendeDocsUtil) {

    return BaseController.extend("de.sachsen.sab.antrdatpruf.controller.antragsdatenerfassung.BaseFormularController", {

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit: function () {
            // attach handlers for validation errors
            sap.ui.getCore().attachValidationError(function (evt) {
                let control = evt.getParameter("element");
                if (control && control.setValueState) {
                    control.setValueState("Error");
                }
            });
            sap.ui.getCore().attachValidationSuccess(function (evt) {
                let control = evt.getParameter("element");
                if (control && control.setValueState) {
                    control.setValueState("None");
                }
            });
            this.initErrMsgPopover(this.getView());
        },


        /**
         * Destroy
         */
        onExit: function () {
            if (this._oPopover) {
                this._oPopover.destroy();
            }
            this._destroyErrMsgStrip();
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /**
         * Display the ErrMsgPopover over the caller element
         *
         * @param {Object} oEvent the event
         */
        onMessagePopoverPress: function (oEvent) {
            this._getMessagePopover().openBy(oEvent.getSource());
        },

        /**
         * Event handler for navigating back.
         * We navigate back in the browser history
         */
        onNavBackFormular: function () {
            let bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
            sap.m.MessageBox.show("Achtung: Die Daten werden nicht gespeichert \n" +
            "Details zeigen aktuelle Antragsdaten an", {
                icon: sap.m.MessageBox.Icon.WARNING,
                title: "Vorsicht!",
                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                onClose: this.__fnCallbackMessageBox,
                details: oldAntragsData.getData(),
                styleClass: bCompact ? "sapUiSizeCompact" : "",
                contentWidth: "100px"
            });
        },

        /**
         * Checks the validation, if OK then SAVE DATA and continue
         * if NOT OK ERR
         *
         * @param oPage the page to be validated
         */
        onHandleContinue: function (oPage) {
            let canContinue = this._validate(oPage);
            // collect input controls
            if (canContinue) {
                sap.m.MessageToast.show("Die Daten wurden gespeichert", {
                    duration: 4000,
                    width: "35em"
                });
                sap.ui.controller("de.sachsen.sab.antrdatpruf.controller.BaseController").onNavBack();
            } else {
                this._generateErrMsgStrip("Der Speicherungsvorgang kann aufgrund der Fehler nicht abgeschlossen werden", "Error");
            }
        },

        /**
         * Handle reject button pressed
         *
         * @param oEvent Event
         */
        onHandleReject: function (oEvent) {
            if (!this._oPopover) {
                this._oPopover = sap.ui.xmlfragment("de.sachsen.sab.antrdatpruf.view.fragmente.NavBackFormPopover", this);
                this.getView().addDependent(this._oPopover);
            }
            this._oPopover.openBy(oEvent.getSource());
        },

        /**
         * On validate in current formular
         */
        onValidateBtnPress: function () {
            this.onHandleContinue(this.getView().byId("page"));
        },


        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * callback function for the messagebox
         */
        __fnCallbackMessageBox: function (sResult) {
            if (sResult === 'OK') {
                sap.ui.getCore().setModel(window.oldAntragsData, "antragsData");
                sap.ui.controller("de.sachsen.sab.antrdatpruf.controller.BaseController").onNavBack();
            } else {
                //
            }
        },

        /**
         * gets called errtime route matches
         * here we make a data backup for userinput
         */
        handleRouteMatched: function (oEvent) {
            let oAntragsData = sap.ui.getCore().getModel("antragsData");
            this.getView().setModel(oAntragsData, "antragsData");
            //cloning jsondata
            window.oldAntragsData = this.__cloneObject(oAntragsData.getData());
            this._destroyErrMsgStrip();
        },

        /**
         * handle Reject ok
         * @param {object} oEvent das Event
         */
        handlePopoverOK: function (oEvent) {
            this._oPopover.close();
            sap.ui.getCore().setModel(this.__cloneObject(window.oldAntragsData.getData()), "antragsData");
            this.getView().setModel(this.__cloneObject(window.oldAntragsData.getData()), "antragsData");
            this.getView().getModel("antragsData").updateBindings(true);
            MessageToast.show('Aenderungen wurden verworfen.');
        },

        /**
         * handle Reject false
         * @param {object} oEvent das Event
         */
        handlePopoverCancel: function (oEvent) {
            this._oPopover.close();
        },

        __cloneObject(oObj) {
            try {
                return new sap.ui.model.json.JSONModel(JSON.parse(JSON.stringify(oObj)));
            } catch (err) {
                jQuery.sap.log.info('an error occures ' + err);
            }
            return null;
        },

        /**
         * Init errMsgPopover which displays the errors on current form
         *
         * @param oView
         */
        initErrMsgPopover(oView) {
            let oMessageManager = sap.ui.getCore().getMessageManager();
            oView.setModel(oMessageManager.getMessageModel(), "message");
            oMessageManager.registerObject(oView, true);
        },

        /**
         * Returns a singleton MessagePopover Object
         *
         * @returns {sap.ui.core.Control|sap.ui.core.Control[]|*|de.sachsen.sab.antrdatpruf.controller.antragsdatenerfassung.BaseFormularController._oMessagePopover}
         * @private
         */
        _getMessagePopover: function () {
            if (!this._oMessagePopover) {
                this._oMessagePopover = sap.ui.xmlfragment(this.getView().getId(), "de.sachsen.sab.antrdatpruf.view.fragmente.MessagePopover", this);
                this.getView().addDependent(this._oMessagePopover);
            }
            return this._oMessagePopover;
        },

        /**
         * internal validation
         * @param oPage the page
         * @returns {boolean}
         * @private
         */
        _validate: function (oPage) {
            let validator = new Validator();
            return validator.validate(oPage);
        },

        /**
         * Generates an error msg strip
         */
        _generateErrMsgStrip: function (sMsg, sType) {
            this._destroyErrMsgStrip();
            let oPage = this.getView().byId("page");

            let oE = this.byId("oVerticalContent");
            let oMsgStrip = new MessageStrip("msgStrip", {
                text: sMsg,
                showCloseButton: true,
                showIcon: true,
                type: sType
            });
            oE.addContent(oMsgStrip);
            oPage.scrollTo(0);
        },

        _destroyErrMsgStrip: function() {
            let oMs = sap.ui.getCore().byId("msgStrip");
            if (oMs) {
                oMs.destroy();
            }
        },

        _setErrorInputs: function (oView) {
            let aProp;
            try {
                let oAntragsData = sap.ui.getCore().getModel("antragsData");
                aProp = oAntragsData.getProperty("/gepruefte_daten").value;
            } catch (e) {
                jQuery.sap.log.info('Keine Errorcodes vorhanden,' + e);
            }
            if (aProp) {
                //set icons on invalid data
                try {
                    aProp = JSON.stringify(aProp);
                    FehlendeDocsUtil.getInstance(oView).setErrorIconsOnPage(aProp, oView);
                } catch (ex) {
                    jQuery.sap.log.info('An error occures while trying to set errror icons' + ex);
                }
            }
        }

    });
});