/*global sap */
sap.ui.define([
    'sap/m/StandardTreeItem',
], function (StandardTreeItem) {
    "use strict";

    const aStandardunterlagen = [
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

    const mDocsArrays = new Map([['Standardunterlagen', aStandardunterlagen],
        ['AllgemeineBonitaetsunterlagen', aAllgemeineBonitaetsunterlagen],
        ['BonitaetsunterlagenNichtselbststaendige', aBonitaetsunterlagenNichtselbststaendige],
        ['BonitaetsunterlagenKindernachweis', aBonitaetsunterlagenKindernachweis],
        ['PlausibilitaetBonitaetsunterlagen', aPlausibilitaetBonitaetsunterlagen]
    ]);


    return sap.m.StandardTreeItem.extend('de.sachsen.sab.antrdatpruf.controller.antragsdatenerfassung.DocumentTreeItem', {
        metadata: {
            properties: {
                status: 'string'
            }
        },

        onAfterRendering: function () {
            if (StandardTreeItem.prototype.onAfterRendering) {
                StandardTreeItem.prototype.onAfterRendering.apply(this, null);
            }
            //get the missing docs string array {global object}
            let aMissingDocs = [...window.gMissingDoc];

            //Adds the parent node to the list of nodes to be set to ERROR state, if a node contained in a parent node has errors.
            //If some of the docs which are missing are contained in the parent node, then set the parent node
            //state to ERROR too
            let sNodeText = this.getBindingContext().getObject().text;
            if (Array.isArray(aMissingDocs) && aMissingDocs.length > 0) {
                for (let [key, value] of mDocsArrays) {
                    if (sNodeText.localeCompare(key) === 0) {
                        aMissingDocs.forEach(sMissingDoc => {
                            if (value.includes(sMissingDoc)) {
                                aMissingDocs.push(key);
                            }
                        });
                    }
                }
                aMissingDocs.forEach(sItem => {
                    if (sNodeText.localeCompare(sItem) === 0) {
                        this.$().find(".sapMLIBContent").addClass("redColor");
                        this.$().find(".sapMSTIIcon").addClass("redColor");
                    }
                });
            } else {
                //No documents missing, so set the icons to green
                for (let [key, value] of mDocsArrays) {
                    if (sNodeText.localeCompare(key) === 0) {
                        this.$().find(".sapMSTIIcon").addClass("greenColor");
                    }
                }
                jQuery.sap.log.info('Keine fehlende Dokumente erkannt!');
            }
        },
        renderer: {}

    });
});