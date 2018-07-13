/*global sap */
sap.ui.define([
    'sap/m/StandardTreeItem',
], function (StandardTreeItem) {
    "use strict";

    const aStandardunterlagen = [
        'Antrag',
        'Identitaetsfeststellung',
        'Identitätsfeststellung',
        'Grundbuch',
        'Bauplaene',
        'detaillierte_Kostenaufstellung_nach_Gewerken',
        'Wohnflaechenberechnung'
    ];

    const aAllgemeineBonitaetsunterlagen = [
        'Selbstauskunft',
        'Eigenmittelnachweis',
        'Einkommensnachweise_der_letzten_3_Monate',
        'Einnahmen_und_Ueberschussrechnung_der_letzten_3_Jahre',
        'Jahresabschluss',
        'Kindergeldbescheid',
        'Kopie_Kontoauszug_mit_Kindergeldzahlung',
        'Nachweis_ueber_Kindergeld'
    ];

    const mDocsArrays = new Map([['Standardunterlagen', aStandardunterlagen],
        ['AllgemeineBonitaetsunterlagen', aAllgemeineBonitaetsunterlagen]
    ]);


    return sap.m.StandardTreeItem.extend('de.sachsen.sab.antrdatpruf.controller.antragsdatenerfassung.DocumentTreeItem', {

        onAfterRendering: function () {
            if (StandardTreeItem.prototype.onAfterRendering) {
                StandardTreeItem.prototype.onAfterRendering.apply(this, null);
            }
            //get the missing docs string array {global object}
            let aMissingDocs = [...window.gMissingDoc];


            //Adds the parent node to the list of nodes to be set to ERROR state, if a node contained in a parent node has errors.
            //If some of the docs which are missing are contained in the parent node, then set the parent node
            //state to ERROR too
            let aNodeText = [];
            aNodeText.push(this.getBindingContext().getObject().text);
            aNodeText.push("Dokument_Typ_" + this.getBindingContext().getObject().text);
            if (aMissingDocs.length > 0) {
                for (let [key, value] of mDocsArrays) {
                    aNodeText.forEach(e => {
                        if (e.includes(key)) {
                            aMissingDocs.forEach(sMissingDoc => {
                                value.forEach( ele => {
                                    if (ele.includes(sMissingDoc)) {
                                        aMissingDocs.push(key);
                                    }
                                });
                            });
                        }
                    })
                }
                aMissingDocs.forEach(sItem => {
                    aNodeText.forEach( e => {
                        if (e.includes(sItem)) {
                            this.$().find(".sapMLIBContent").addClass("redColor");
                            this.$().find(".sapMSTIIcon").addClass("redColor");
                        }
                    })
                });
            } else {
                //No documents missing, so set the icons to green
                for (let [key, value] of mDocsArrays) {
                    aNodeText.forEach(e => {
                        if (e.localeCompare(key) === 0) {
                            this.$().find(".sapMSTIIcon").addClass("greenColor");
                        }
                    })
                }
                jQuery.sap.log.info('Keine fehlende Dokumente erkannt!');
            }
        },
        renderer: {}

    });
});