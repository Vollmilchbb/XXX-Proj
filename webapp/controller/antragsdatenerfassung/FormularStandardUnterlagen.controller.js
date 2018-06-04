/*eslint-disable no-console, no-alert */
sap.ui.define([
		"de/sachsen/sab/antrdatpruf/controller/antragsdatenerfassung/BaseFormularController"
	], function (BaseFormularController) {
		

		return BaseFormularController.extend("de.sachsen.sab.antrdatpruf.controller.antragsdatenerfassung.FormularStandardUnterlagen", {

			onInit: function() {
				this.getRouter().attachRouteMatched(this.handleRouteMatched, this);
				this.initErrMsgPopover(this.getView());
                this._setErrorInputs(this.getView());
			}
		});
	}
);
///			let checkboxes = [
//                  view.byId("chkbxAntrStlrAngstlt"),
//                  view.byId("chkbxAntrStlr2Angstlt"),
//                  view.byId("chkbxNatPerson"),
//                  view.byId("chkbxKindergeldNachweis"),
//                  view.byId("chkbxAntragVorhanden"),
//                  view.byId("chkbxBauplaeneVorhanden"),
//                  view.byId("chkbxEigenmittelnachweis"),
//                  view.byId("chkbxEinkommensnachweis"),
//                  view.byId("chkbxGrundbuchVorhanden"),
//                  view.byId("chkbxIdentitaetsfeststellung"),
//                  view.byId("chkbxVermoegenVorhanden"),
//                  view.byId("chkbxEinwilligungDatenschutz"),
//                  view.byId("chkbxEinwilligungBankauskuenfte"),
//                  view.byId("chkbxZahlnachweisKindergeld"),
//                  view.byId("chkbxEinhaltungGWG"),
//                  view.byId("chkbxAntragVollstRichtigUntrschrbn"),
//                  view.byId("chkbxKindergeldBescheid"),
//                  view.byId("chkbxWohnflaechenberechnung")
///			];