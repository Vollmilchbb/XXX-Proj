sap.ui.define([
    "sap/ui/base/Object"
], function(Object) {
    "use strict";

    //TODO ergaenzen von antraege Vorhanden und Richtigkeit der Antragsdaten
    let instance;

    const aStandardunterlagen =  [
        'Dokument_Typ_Antrag',
        'Dokument_Typ_Eigenmittelnachweis',
        'Dokument_Typ_Grundbuch',
        'Dokument_Typ_Wohnflaechenberechnung',
        'Dokument_Typ_Bauplaene',
        'Dokument_Typ_detaillierte_Kostenaufstellung_nach_Gewerken',
        'Dokument_Typ_Identitaetsfeststellung',
        'Dokument_Typ_Selbstauskunft',
        'Dokument_Typ_Einnahmen_und_Ueberschussrechnung_der_letzten_3_Jahre'
    ];

    const aAllgemeineBonitaetsunterlagen = [
        'Dokument_Typ_Antrag',
        'Dokument_Typ_Eigenmittelnachweis',
        'Dokument_Typ_Grundbuch',
        'Dokument_Typ_Wohnflaechenberechnung',
        'Dokument_Typ_Bauplaene',
        'Dokument_Typ_detaillierte_Kostenaufstellung_nach_Gewerken',
        'Dokument_Typ_Identitaetsfeststellung',
        'Dokument_Typ_Selbstauskunft',
        'Dokument_Typ_Einkommensnachweise_der_letzten_3_Monate'
    ];

    const aBonitaetsunterlagenNichtselbststaendige = [
        'Dokument_Typ_Antrag',
        'Dokument_Typ_Eigenmittelnachweis',
        'Dokument_Typ_Grundbuch',
        'Dokument_Typ_Wohnflaechenberechnung',
        'Dokument_Typ_Bauplaene',
        'Dokument_Typ_detaillierte_Kostenaufstellung_nach_Gewerken',
        'Dokument_Typ_Identitaetsfeststellung',
        'Dokument_Typ_Selbstauskunft',
        'Dokument_Typ_Einkommensnachweise_der_letzten_3_Monate'
    ];

    const aBonitaetsunterlagenKindernachweis = [
        'Dokument_Typ_Antrag',
        'Dokument_Typ_Eigenmittelnachweis',
        'Dokument_Typ_Grundbuch',
        'Dokument_Typ_Wohnflaechenberechnung',
        'Dokument_Typ_Bauplaene',
        'Dokument_Typ_detaillierte_Kostenaufstellung_nach_Gewerken',
        'Dokument_Typ_Identitaetsfeststellung',
        'Dokument_Typ_Selbstauskunft',
        'Dokument_Typ_Jahresabschluss'
    ];

    const aPlausibilitaetBonitaetsunterlagen = [
        'Dokument_Typ_Antrag',
        'Dokument_Typ_Eigenmittelnachweis',
        'Dokument_Typ_Grundbuch',
        'Dokument_Typ_Wohnflaechenberechnung',
        'Dokument_Typ_Bauplaene',
        'Dokument_Typ_detaillierte_Kostenaufstellung_nach_Gewerken',
        'Dokument_Typ_Jahresabschluss'
    ];

    let mainFormularService = Object.extend("de.sachsen.sab.antrdatpruf.controller.util.FehlendeDocsUtil", {

        constructor : function(oView){
            this.iconStandardUnterlageID = oView.byId('iconStandardUnterlageID');
            this.iconAllgBonUnterlagenID = oView.byId('iconAllgBonUnterlagenID');
            this.iconBonKindNachweisID = oView.byId('iconBonKindNachweisID');
            this.iconBonPlausiID = oView.byId('iconBonPlausiID');
            this.iconAntraegeVorhID = oView.byId('iconAntraegeVorhID');
            this.iconRichtigkeitAntrDatenID = oView.byId('iconRichtigkeitAntrDatenID');
            this.iconBonUnlNichtSelbstStID = oView.byId('iconBonUnlNichtSelbstStID');
            this.allIcons = [this.iconStandardUnterlageID, this.iconAllgBonUnterlagenID, this.iconBonKindNachweisID, this.iconBonPlausiID, this.iconAntraegeVorhID, this.iconRichtigkeitAntrDatenID, this.iconBonUnlNichtSelbstStID];
        },

        setErrorIconsOnPage : function(sInput){
            let that = this;
            this._setIconsGreen(this.allIcons);

            if (Array.isArray(sInput)) {
                sInput.forEach(function(item) {
                    if (that._arrayContainsItem(aStandardunterlagen, item)) {
                        that._setIconColorRed(that.iconStandardUnterlageID);
                    }
                    if (that._arrayContainsItem(aAllgemeineBonitaetsunterlagen, item)) {
                        that._setIconColorRed(that.iconAllgBonUnterlagenID);
                    }
                    if (that._arrayContainsItem(aBonitaetsunterlagenNichtselbststaendige, item)) {
                        that._setIconColorRed(that.iconBonUnlNichtSelbstStID);
                    }
                    if (that._arrayContainsItem(aBonitaetsunterlagenKindernachweis, item)) {
                        that._setIconColorRed(that.iconBonKindNachweisID);
                    }
                    if (that._arrayContainsItem(aPlausibilitaetBonitaetsunterlagen, item)) {
                        that._setIconColorRed(that.iconBonPlausiID);
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
                instance = new mainFormularService(oView);
            }
            return instance;
        }
    };
});