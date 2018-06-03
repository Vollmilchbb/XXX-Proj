/*eslint-disable no-console, no-alert */
sap.ui.define([
		"de/sachsen/sab/antrdatpruf/controller/antragsdatenerfassung/BaseFormularController",
		"de/sachsen/sab/antrdatpruf/controller/util/FehlendeDocsUtil"
	], function (BaseFormularController, FehlendeDocsUtil) {
		

		return BaseFormularController.extend("de.sachsen.sab.antrdatpruf.controller.antragsdatenerfassung.AllgemeineAntragsdaten", {

			onInit: function() {
				this.getRouter().attachRouteMatched(this.handleRouteMatched, this);
				this.getRouter().attachRouteMatched(this._setErrorInputs, this);
				this.initErrMsgPopover(this.getView());
			},


			_setErrorInputs: function() {
				let view = this.getView(),
					aProp;
				try {
					let oAntragsData = sap.ui.getCore().getModel("antragsData");
					aProp = oAntragsData.getProperty("/gepruefte_daten").value;
				} catch (e) {
					jQuery.sap.log.info('Keine Errorcodes vorhanden,' + e);
				}
				if (aProp) {
					//set icons on invalid data
					try {
						FehlendeDocsUtil.getInstance(view).setErrorIconsOnPage(aProp, view);
					} catch (ex) {
						jQuery.sap.log.info('An error occures while trying to set errror icons' + ex);
					}
				}
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