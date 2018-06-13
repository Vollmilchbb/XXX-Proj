sap.ui.define([
    "sap/ui/base/Object"
], function(Object) {
    "use strict";

    let instance;

    let MainFormularService = Object.extend("de.sachsen.sab.antrdatpruf.controller.util.FehlendeDocsUtil", {

        //constructor : function(oView){
        //    this.iconStandardUnterlageID = oView.byId('iconStandardUnterlageID');
        //    this.iconAllgBonUnterlagenID = oView.byId('iconAllgBonUnterlagenID');
        //    this.iconBonKindNachweisID = oView.byId('iconBonKindNachweisID');
        //    this.iconBonPlausiID = oView.byId('iconBonPlausiID');
        //    this.iconAntraegeVorhID = oView.byId('iconAntraegeVorhID');
        //    this.iconRichtigkeitAntrDatenID = oView.byId('iconRichtigkeitAntrDatenID');
        //    this.iconBonUnlNichtSelbstStID = oView.byId('iconBonUnlNichtSelbstStID');
        //    this.allIcons = [this.iconStandardUnterlageID, this.iconAllgBonUnterlagenID, this.iconBonKindNachweisID, this.iconBonPlausiID, this.iconAntraegeVorhID, this.iconRichtigkeitAntrDatenID, this.iconBonUnlNichtSelbstStID];
        //},

        setErrorIconsOnPage : function(sInput, oView){
            //this._setIconsGreen(this.allIcons);
            let aFehlerCodes = JSON.parse(sInput);
            if (Array.isArray(aFehlerCodes)) {
                aFehlerCodes.forEach(function(item) {
                    try {
                        let oItem = oView.byId(item.variable);
                        if (oItem && oItem instanceof sap.ui.core.Control) {
                            oItem.setValueState('Error');
                            oItem.setValueStateText(item.error_text);
                        }
                    } catch (err) {
                        jQuery.sap.log.info('Es ist ein Fehler aufgetreten, die Fehlende Dokumente sind nicht in einer Array-Variable gespeichert!');
                    }
                });
            } else {
                jQuery.sap.log.info('Es ist ein Fehler aufgetreten, die Fehlende Dokumente sind nicht in einer Array-Variable gespeichert!');
            }
        },

        _setIconsGreen : function(aAllIcons){
            aAllIcons.forEach(function(entry) {
                entry.setColor("#2B7D2B");
                entry.setSrc("sap-icon://message-success");
            });
        },

        _setIconColorRed : function(oIcon) {
            oIcon.setColor("#BB0000");
            oIcon.setSrc("sap-icon://message-error");
        },

        _arrayContainsItem(aArray, oItem) {
            return aArray.indexOf(oItem) > -1;
        }
    });

    return {
        getInstance: function (oView) {
            if (!instance) {
                instance = new MainFormularService(oView);
            }
            return instance;
        }
    };
});