sap.ui.define([
    "sap/ui/base/Object"
], function(Object) {
    "use strict";

    let instance;

    const aAllgemeineAntragsdaten = [
        'Antrag_Vordrucknummer',
        'Antrag_natuerliche_Person',
        'Antrag_Antragsnummer',
        'Bestand_Kundennummer',
        'Antrag_Umsetzung_Geldwaeschegesetz',
        'Antrag_Erklaerung_Einholung_bankmaessiger_Auskuenfte',
        'Antrag_Vollstaendigkeit_und_Richtigkeit',
        'Antrag_AllgAngaben_Antragsteller_Anrede',
        'Antrag_AllgAngaben_Antragsteller_Name',
        'Antrag_AllgAngaben_Antragsteller_Geburtsdatum',
        'Antrag_AllgAngaben_Antragsteller_Strasse',
        'Antrag_AllgAngaben_Antragsteller_PLZ',
        'Antrag_AllgAngaben_Antragsteller_Ort'
    ];

    const aKostenFinanzierung = [
        'Antrag_KoFi_Kosten_BaukostenGebaeude',
        'Antrag_KoFi_Kosten_SummeKosten',
        'Antrag_KoFi_Gesamtkosten',
        'Antrag_KoFi_Eigenkapital_SonstigesEigenkapital',
        'Antrag_KoFi_Fremdmittel_SABFordererganzungsdarlehen',
        'Antrag_KoFi_Fremdmittel_GruppeFordererganzungsdarlehen_Betrag',
        'Antrag_KoFi_Fremdmittel_GruppeFordererganzungsdarlehen_Gesamtlaufzeit_Monate',
        'Antrag_KoFi_Fremdmittel_GruppeFordererganzungsdarlehen_Gesamtlaufzeit',
        'Antrag_KoFi_Fremdmittel_GruppeFordererganzungsdarlehen_Tilgung',
        'Antrag_KoFi_Fremdmittel_GruppeFordererganzungsdarlehen_Tilgungsfreijahre',
        'Antrag_KoFi_Fremdmittel_GruppeFordererganzungsdarlehen_Zinsfestschreibung_Monate',
        'Antrag_KoFi_Fremdmittel_GruppeFordererganzungsdarlehen_Zinsfestschreibung',
        'Antrag_KoFi_Gesamtfinanzierung'
    ];

    const aVorhabensdaten = [
        'Antrag_Vorhaben_Vorhabensbeschreibung',
        'Antrag_Objekt_StrasseObjekt',
        'Antrag_Objekt_HausnummerObjekt',
        'Antrag_Objekt_PLZObjekt',
        'Antrag_Objekt_OrtObjekt',
        'Antrag_Objekt_Gemarkung',
        'Antrag_Objekt_Flur',
        'Antrag_Objekt_Antragwohnflallg',
        'Antrag_Objekt_Hochwasservorsorge',
        'Antrag_Vorhaben_Baubeginn',
        'Antrag_Vorhaben_EnNiveauNeu'
    ];

    const mVarPruefungen = new Map([['allgemeineAntragsdaten', aAllgemeineAntragsdaten],
        ['kostenFinanzierung', aKostenFinanzierung],
        ['vorhabensdaten', aVorhabensdaten]
    ]);

    let MainFormularService = Object.extend("de.sachsen.sab.antrdatpruf.controller.util.ErrorVariablesUtil", {

        constructor : function(oView){
            this.iconAllgemeineAntragsdatenID = oView.byId('iconAllgemeineAntragsdatenID');
            this.iconKostenFinanzierungID = oView.byId('iconKostenFinanzierungID');
            this.iconVorhabensdatenID = oView.byId('iconVorhabensdatenID');
            //noch net da
            this.iconBonKindNachweisID = oView.byId('iconBonKindNachweisID');
            this.iconBonPlausiID = oView.byId('iconBonPlausiID');
            this.iconAntraegeVorhID = oView.byId('iconAntraegeVorhID');
            this.iconRichtigkeitAntrDatenID = oView.byId('iconRichtigkeitAntrDatenID');
            this.allIcons = [this.iconAllgemeineAntragsdatenID, this.iconKostenFinanzierungID, this.iconVorhabensdatenID, this.iconBonKindNachweisID, this.iconBonPlausiID, this.iconAntraegeVorhID, this.iconRichtigkeitAntrDatenID];
        },


        /**
         * fields in every formular page
         *
         * @param sInput
         * @param oView
         */
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

        /**
         * icons on main form
         *
         * @param sInput
         * @param oView
         */
        setErrorIconsOnMainForm : function(sInput, oView) {
            let aFehlerCodes = JSON.parse(sInput);
            let that = this;
            if (Array.isArray(aFehlerCodes)) {
                aFehlerCodes.forEach(function(item) {
                    try {
                        for (let [key, value] of mVarPruefungen) {
                            if (value.includes(item.variable)) {
                                switch (key) {
                                    case "allgemeineAntragsdaten":
                                        that._setIconColorRed(that.iconAllgemeineAntragsdatenID);
                                        break;
                                    case "kostenFinanzierung":
                                        that._setIconColorRed(that.iconKostenFinanzierungID);
                                        break;
                                    case "vorhabensdaten":
                                        that._setIconColorRed(that.iconVorhabensdatenID);
                                        break;
                                    default:
                                        jQuery.sap.log.info('Ein Fehler ist in einer Pruefung aufgertreten die noch nicht geclustert ist!');
                                }
                            }
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