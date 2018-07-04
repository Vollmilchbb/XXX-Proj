sap.ui.define([
    "de/sachsen/sab/antrdatpruf/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "de/sachsen/sab/antrdatpruf/controller/util/ErrorVariablesUtil",
    "de/sachsen/sab/antrdatpruf/generated/rest-api-bundle",
    "de/sachsen/sab/antrdatpruf/controller/antragsdatenerfassung/DocumentTreeItem",
    "sap/ui/core/message/Message",
    "sap/m/MessageBox",
    "de/sachsen/sab/antrdatpruf/controller/util/moment.min"
], function (BaseController, JSONModel, MessageToast, ErrorVariablesUtil, camundajs, DocumentTreeItem, Message, MessageBox, momentjs) {

    return BaseController.extend("de.sachsen.sab.antrdatpruf.controller.antragsdatenerfassung.MainFormular", {

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */
        onInit: function () {
            //initialize route matched event
            this._oRouter = this.getRouter();
            //sets the icons red if variables contain errors
            this._oRouter.attachRouteMatched(this._handleRouteMatched, this);
            this.getRouter().getRoute("antragsDatenErfassung").attachPatternMatched(this._handleTreeMissingDocs, this);

            let oBusyDialogGlobal = new sap.m.BusyDialog();
            oBusyDialogGlobal.open();
            sap.ui.getCore().oBusyDialogGlobal = oBusyDialogGlobal;

            //debug zeug
            let oModeljson = new sap.ui.model.json.JSONModel();
            oModeljson.loadData(jQuery.sap.getModulePath("de.sachsen.sab.antrdatpruf", "/json/antragsData2.json"), "", false);
            this.getView().setModel(oModeljson, "antragsData");
            sap.ui.getCore().setModel(oModeljson, "antragsData");

            //COMMENT THIS
            sap.ui.getCore().oBusyDialogGlobal.close();
            this._initGeschaeftsVPModel();
            this._initTreeMissingDocsModel();
            this._initErrMsgPopover(this.getView());

            //call to camnunda to get data
            //this._onExternalCallMatched();
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        _onExternalCallMatched: function () {
            let that = this,
                core = sap.ui.getCore();
            let taskId;
            if (!this._taskId) {
                let startupParams = this.getOwnerComponent().getComponentData().startupParameters; // get Startup params from Owner Component
                if ((startupParams.taskId && startupParams.taskId[0])) {
                    let taskApi = new Camunda.RestApi.TaskApi();
                    taskId = startupParams.taskId[0];
                    this._taskId = taskId;
                    taskApi.getTask(taskId, function (error, data, response) {
                        let taskJson = JSON.parse(response.text);
                        let processID = taskJson.processInstanceId;
                        if (processID) {
                            let oModel = that.getView().getModel("antragsData");
                            oModel.setProperty("/Klaerung_Antragsdatenpruefung", "");
                            let processApi = new Camunda.RestApi.ProcessInstanceApi();
                            processApi.getVariablesResource(
                                processID,
                                function (error, data, response) {
                                    if (error) {
                                        sap.ui.getCore().oBusyDialogGlobal.close();
                                        sap.ui.getCore().getMessageManager().addMessages(new Message({
                                            message: 'Antragsdaten konnten nicht ermittelt werden',
                                            type: 'Error',
                                            title: 'Verbindungsfehler',
                                            description: 'Eventuell besteht ein Verbindungsproblem mit Camunda'
                                        }));
                                    } else {
                                        sap.ui.getCore().oBusyDialogGlobal.close();
                                        oModel.setData(JSON.parse(response.text));
                                        that.getView().setModel(oModel, "antragsData");
                                        core.setModel(oModel, "antragsData");
                                    }
                                }
                            );
                        }
                    });
                } else {
                    jQuery.sap.log.info('Keine Startparameter erhalten!,' + e);
                }
            }
        },

        /**
         * send email action static showcase
         * //TODO GP ANBINDUNG
         *
         */
        onSendGPMail: function () {
            sap.m.URLHelper.triggerEmail("gpmail@some-mail.com", "SAB-Subject", "Hallo GP, \n  wir benoetigen zusaetzlich noch die Formulare XYZ, AYZ, ZZZ und BCA. \nGruezli");
        },

        /**
         * On Standardpruefung btn Anzeigen click
         */
        onPrufStandardUnterlagen: function () {
            this.getRouter().navTo("standardunterlagen");
        },

        /**
         * On prufAllgBon Anzeigen click
         */
        onPrufAllgBonUnterlagen: function () {
            this.getRouter().navTo("allgBonitaetsunterlagen");
        },

        /**
         * On Bonitaetsunterlagen fuer Kindernachweis click
         */
        onPrufBonUnterlagenFurKinderNachweis: function () {
            this.getRouter().navTo("bonUnterlagenKinderNachweis");
        },

        /**
         * On Plausibilitaet der Bonitaetsunterlagen click
         */
        onPlausiBonitaetsUnterlagen: function () {
            this.getRouter().navTo("plausiBonitaetsUnterlagen");
        },

        /**
         * On AntraegeVorhanden click
         */
        onRichtigkeitAntragsdaten: function () {
            this.getRouter().navTo("richtigkeitAntragsdaten");
        },

        /**
         * Richtigkeit AntragsDaten click
         */
        onAntraegeVorhanden: function () {
            this.getRouter().navTo("antraegeVorhanden");
        },

        /**
         * BonitaetsUnterlagen Nicht Selbststaendig
         */
        onPrufBonUnlNichtSelbstst: function () {
            this.getRouter().navTo("vorhabensdaten");
        },

        /**
         * On Sachverhalt nicht klaerbar press
         */
        onSachverhaltNichtKlaerbar: function () {
            this.getRouter().navTo("sachverhaltNichtKlaerbar");
        },

        /**
         * Display the ErrMsgPopover over the caller element
         *
         * @param {Object} oEvent the event
         */
        onMessagePopoverPress: function (oEvent) {
            this._getMessagePopover().openBy(oEvent.getSource());
        },

        /**
         * On Sachverhalt Geklaert press
         */
        onSachverhaltGeklaert: function () {
            let oModeljson = new sap.ui.model.json.JSONModel();
            oModeljson.loadData(jQuery.sap.getModulePath("de.sachsen.sab.antrdatpruf", "/json/antragsData.json"), "", false);
            oModeljson.setData(this._formatDatesInModel(oModeljson.getData()));

            this._completeTask();
        },

        onZwischenSpeichern: function () {
            let taskApi = new Camunda.RestApi.TaskApi(),
                taskId = this._getTaskId(),
                oBundle = this.getResourceBundle();

            oModel = sap.ui.getCore().getModel("antragsData").getData();
            let oModelToSave = jQuery.extend(true, {}, oModel);
            this._deleteWrongDataFields(oModelToSave);

            let opts = {'body': JSON.stringify({modifications: oModelToSave})};
            if (taskId) {
                sap.ui.core.BusyIndicator.show();
                taskApi.modifyVariables_0(taskId, opts, function (error, data, response) {
                    if (error) {
                        sap.ui.getCore().getMessageManager().addMessages(new Message({
                            message: oBundle.getText("SaveError"),
                            type: "Error",
                            title: oBundle.getText("SaveErrorTitle"),
                            description: oBundle.getText("SaveErrorDescription")
                        }));
                        sap.ui.core.BusyIndicator.hide();
                    } else {
                        MessageToast.show(oBundle.getText("SaveSuccess"));
                        sap.ui.core.BusyIndicator.hide();
                    }
                });
            }
        },

        /*
         * net wundern wurde so gewuenscht vom test : ))
         */
        onAbmeldenOhneSpeichern: function () {
            this._navigateBackToInbox();
        },

        /**
         * set models on the view for the GP and Kunde
         * TODO GP anbindung
         */
        _initGeschaeftsVPModel: function () {
            let oModel = new sap.ui.model.json.JSONModel();
            oModel.loadData(jQuery.sap.getModulePath("de.sachsen.sab.antrdatpruf", "/json/geschaeftsvorfall.json"), "", false);
            this.getView().setModel(oModel, "modelGeschVorfall");
            let oModelGP = new sap.ui.model.json.JSONModel();
            oModelGP.loadData(jQuery.sap.getModulePath("de.sachsen.sab.antrdatpruf", "/json/geschpartn.json"), "", false);
            this.getView().setModel(oModelGP, "modelGPKunde");
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         *
         */
        _handleRouteMatched: function () {
            let aProp;
            sap.ui.getCore().getMessageManager().removeAllMessages();
            let view = this.getView();
            try {
                let oAntragsData = sap.ui.getCore().getModel("antragsData");
                aProp = oAntragsData.getProperty("/gepruefte_daten").value;
            } catch (e) {
                jQuery.sap.log.info('Keine Errorcodes vorhanden,' + e);
            }
            if (aProp) {
                try {
                    //set icons on invalid data
                    ErrorVariablesUtil.getInstance(view).setErrorIconsOnMainForm(aProp, view);
                } catch (ex) {
                    jQuery.sap.log.info('An error occures while trying to set errror icons' + ex);
                }
            }
        },

        /**
         * Init the tree behaviour when docs are missing
         *
         *
         * @private
         */
        _handleTreeMissingDocs: function () {
            let aProp;
            try {
                let oAntragsData = sap.ui.getCore().getModel("antragsData");
                aProp = oAntragsData.getProperty("/Liste_nicht_vorhandener_Dokumente").value;
            } catch (e) {
                jQuery.sap.log.info("Keine Errorcodes fuer Dokumente vorhanden." + e);
            }
            this._initTreeMissingDocsItems(aProp);
            if (aProp !== 'undefined' && Array.isArray(aProp) && !(aProp.length > 0)) {
                sap.ui.getCore().getMessageManager().addMessages(new Message({
                    message: 'Es fehlen keine Dokumente',
                    type: 'Success',
                    title: 'Dokumente Vollst\u00e4ndig',
                    description: 'Die Dokumente sind allesamt vollst\u00e4ndig'
                }));
            }
        }
        ,

        /**
         * Sets the custom docTreeItem to the Trees Item property.
         * Binds the Items
         *
         * @param aProperties missing Docs prop
         * @private
         */
        _initTreeMissingDocsItems(aProperties) {
            //global property
            window.gMissingDoc = aProperties;
            let oTree = this.getView().byId("treeDocsId");
            //oTree.setModel(this.getView().getModel("docTree"));
            let oStandardTreeItem = new DocumentTreeItem({
                title: "{text}",
                icon: "{ref}",
                type: sap.m.ListType.Detail
            });
            oTree.bindItems("/", oStandardTreeItem);
            this._informMissingDocs(aProperties);
        },

        /**
         * Init TreeDocument with initial data
         * @private
         */
        _initTreeMissingDocsModel: function () {
            let treeModel = new sap.ui.model.json.JSONModel();
            //treeModel.loadData("/webapp/json/docTree.json", "", false);
            treeModel.loadData(jQuery.sap.getModulePath("de.sachsen.sab.antrdatpruf", "/json/docTree.json"), "", false);
            this.getView().byId("treeDocsId").setModel(treeModel);
        },

        /**
         * Init errMsgPopover which displays the amount of errors on current form
         *
         * @param oView
         */
        _initErrMsgPopover: function (oView) {
            let oMessageManager = sap.ui.getCore().getMessageManager();
            oView.setModel(oMessageManager.getMessageModel(), "message");
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
         * create messages for each missing doc string
         * @param aProperties
         * @private
         */
        _informMissingDocs: function (aProperties) {
            sap.ui.getCore().getMessageManager().removeAllMessages();
            aProperties.forEach(sItem => {
                sap.ui.getCore().getMessageManager().addMessages(new Message({
                    message: 'Das Dokument ' + sItem + ' ist nicht vorhanden',
                    type: 'Error',
                    title: 'Fehlendes Dokument'
                }));
            });
        },

        /**
         * Complete generated task
         * @private
         */
        _completeTask: function () {
            let taskApi = new Camunda.RestApi.TaskApi();
            let taskId = this._getTaskId();
            let oBundle = this.getResourceBundle();
            let that = this;
            oModel = sap.ui.getCore().getModel("antragsData");

            oModelToSave = jQuery.extend(true, {}, oModel);
            oModelToSave.setData(that._formatDatesInModel(oModelToSave.getData()));

            delete oModelToSave.oData.gepruefte_daten;
            delete oModelToSave.oData.Antrag_Gesamtpruefung_Adresse;
            delete oModelToSave.oData.Liste_nicht_vorhandener_Dokumente;
            delete oModelToSave.oData.Liste_Daten_pruefen;

            let opts = {'body': JSON.stringify({variables: oModelToSave.getData()})};

            sap.ui.core.BusyIndicator.show();

            taskApi.complete(taskId, opts, function (error, data, response) {
                if (error) {
                    sap.ui.getCore().getMessageManager().addMessages(new Message({
                        message: oBundle.getText("SaveTaskError", [error]),
                        type: "Error",
                        title: oBundle.getText("SaveTaskErrorTitle")
                    }));
                    sap.ui.core.BusyIndicator.hide();
                } else {
                    MessageToast.show(oBundle.getText("TaskComplete"));
                    sap.ui.core.BusyIndicator.hide();
                    setTimeout(function(){
                        that._navigateBackToInbox();
                    },1000);
                }
            });
        },

        /**
         * get Taskid
         *
         * @returns {string} TaskID of the generated task
         * @private
         */
        _getTaskId: function () {
            return this._taskId || null;
        },


        /**
         * navigate back to Inbox-App per semantic object navigation
         *
         * @private
         */
        _navigateBackToInbox: function () {
            try {
                let oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
                let hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                    target: {
                        semanticObject: 'zDTINBOX',
                        action: "display"
                    },
                    params: {
                        "taskId": null,
                        "protocol": null
                    }
                })) || ""; // generate the Hash to display a Supplier
                oCrossAppNavigator.toExternal({
                    target: {
                        shellHash: hash
                    }
                }); // navigate to Supplier application
            } catch (e) {
                MessageBox.error(this.getResourceBundle().getText('CrossNavigationNotSupported'), {
                    styleClass: this.getOwnerComponent().getContentDensityClass()
                });
                return null;
            }
        },


        /**
         * Es werden die Felder geloescht die nicht richtig von Camunda verarbeitet werden koennen
         *
         * @param oModel
         * @private
         */
        _deleteWrongDataFields: function (oModel) {
            delete oModel.gepruefte_daten;
            delete oModel.Antrag_Gesamtpruefung_Adresse;
            delete oModel.Liste_nicht_vorhandener_Dokumente;
            delete oModel.Liste_Daten_pruefen;
        },

        /**
         * format all dates in the modelData to pass java.util.Date test for Camunda
         *
         * @param oModelData
         * @private
         */
        _formatDatesInModel: function (oModelData) {
            $.each(oModelData, function( key, value ) {
                if (value.type === 'Date') {
                    value.value = moment(value.value).format("YYYY-MM-DDTHH:mm:ss.SSSZZ");
                    oModelData[key].value = value.value;
                }
            });
            return oModelData;
        }
    });
});