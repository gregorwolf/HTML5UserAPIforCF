const approuter = require("@sap/approuter");
var ar = approuter();
ar.first;
ar.start({
  extensions: [require("./my-ext.js")],
});
