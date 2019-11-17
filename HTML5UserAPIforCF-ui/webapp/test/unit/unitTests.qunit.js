/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/sap/sapmentors/HTML5UserAPIforCF-ui/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});