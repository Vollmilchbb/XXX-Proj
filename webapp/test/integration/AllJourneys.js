/* global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"de/sachsen/sab/Opa5",
	"sap/ui/demo/antrdatpruf/test/integration/pages/Common",
	"de/sachsen/sab/opaQunit",
	"sap/ui/demo/antrdatpruf/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "de.sachsen.sab.antrdatpruf.view."
	});

	sap.ui.require([
		"sap/ui/demo/antrdatpruf/test/integration/navigationJourney"
	], function () {
		QUnit.start();
	});
});