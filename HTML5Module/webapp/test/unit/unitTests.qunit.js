/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
  "use strict";

  sap.ui.require(
    ["com/sap/sapmentors/html5userapiforcf-ui/test/unit/AllTests"],
    function () {
      QUnit.start();
    }
  );
});
