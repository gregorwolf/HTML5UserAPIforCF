sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/Manifest"],
  function (Controller, Manifest) {
    "use strict";

    return Controller.extend(
      "com.sap.sapmentors.html5userapiforcf-ui.controller.Home",
      {
        onInit: function () {
          var url = this.getOwnerComponent()
            .getManifestObject()
            .resolveUri("./");
          console.log(url);
          let oManifest = Manifest.load({ manifestUrl: url + "manifest.json" });
          let version = oManifest.getEntry(
            "/sap.app/applicationVersion/version"
          );
          console.log(version);
          let versionText = this.byId("versionText");
          versionText.setText(version);
        },
      }
    );
  }
);
