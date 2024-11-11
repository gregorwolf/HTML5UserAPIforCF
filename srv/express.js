// load modules
const express = require("express");
// const fesr = require("@sap/fesr-to-otel-js");

// For authentication test
const passport = require("passport");
const xsenv = require("@sap/xsenv");
xsenv.loadEnv();
const { XssecPassportStrategy, XsuaaService } = require("@sap/xssec");
const services = xsenv.getServices({ xsuaa: { tags: "xsuaa" } });
const authService = new XsuaaService(services.xsuaa);
// console.log(services.xsuaa);
const { jwtDecode } = require("jwt-decode");
const { executeHttpRequest } = require("@sap-cloud-sdk/http-client");
const { sendMail } = require("@sap-cloud-sdk/mail-client");
const { retrieveJwt, getDestination } = require("@sap-cloud-sdk/connectivity");

// config
const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 4004;

(async () => {
  // create new app
  const app = express();
  // fesr.registerFesrEndpoint(app);
  // Authentication using JWT
  passport.use(new XssecPassportStrategy(authService));
  app.use(passport.initialize());
  app.use(passport.authenticate("JWT", { session: false }));

  await app.get("/api/userInfo", function (req, res) {
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(req.user));
  });

  await app.get("/api/jwt", function (req, res) {
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify({ JWT: retrieveJwt(req) }));
  });
  await app.get("/api/jwtdecode", function (req, res) {
    if (!req.user) {
      res.statusCode = 403;
      res.end(`Missing JWT Token`);
    } else {
      res.statusCode = 200;
      res.header("Content-Type", "application/json");
      res.end(`${JSON.stringify(jwtDecode(retrieveJwt(req)))}`);
    }
  });

  await app.get("/api/public/ping", async function (req, res) {
    try {
      const resultServiceCollection = await executeHttpRequest(
        getDestination(req),
        {
          method: "get",
          url: "/sap/public/ping",
        }
      );
      res.send(resultServiceCollection.data);
    } catch (error) {
      let message = error.message;
      if (error.rootCause && error.rootCause.message) {
        message += " Root Cause: " + error.rootCause.message;
      }
      res.send(message);
    }
  });

  await app.get("/api/bc/ping", async function (req, res) {
    try {
      const resultServiceCollection = await executeHttpRequest(
        {
          destinationName: process.env.DESTINATION || "SAP_ABAP_BACKEND",
          jwt: retrieveJwt(req),
        },
        {
          method: "get",
          url: "/sap/bc/ping",
        }
      );
      res.send(resultServiceCollection.data);
    } catch (error) {
      let message = error.message;
      if (error.rootCause && error.rootCause.message) {
        message += " Root Cause: " + error.rootCause.message;
      }
      res.send(message);
    }
  });

  await app.get("/api/sendmail", async function (req, res) {
    const from = req.query.from || "sender@dummy.com";
    const to = req.query.to || "receiver@dummy.com";
    const destination = req.query.destination || "inbucket";
    console.log("Destination to send mail: " + destination);
    try {
      const mailConfig = {
        from,
        to,
        subject: "Test from HTML5UserAPIforCF",
        text: "Test Body from HTML5UserAPIforCF",
      };
      console.log("Mail Config: " + JSON.stringify(mailConfig));
      const resolvedDestination = await getDestination({
        destinationName: destination,
        jwt: retrieveJwt(req),
      });

      const mailClientOptions = {};
      // mail. properties allow only lowercase
      if (
        resolvedDestination.originalProperties[
          "mail.clientoptions.ignoretls"
        ] === "true"
      ) {
        mailClientOptions.ignoreTLS = true;
      }
      console.log("Mail Client Options: " + JSON.stringify(mailClientOptions));
      // use sendmail as you should use it in nodemailer
      const result = await sendMail(
        { destinationName: destination, jwt: retrieveJwt(req) },
        [mailConfig],
        mailClientOptions
      );
      res.send(JSON.stringify(result));
    } catch (error) {
      res.send(error);
    }
  });

  // start server
  const server = app.listen(port, host, () => {
    console.info(`app is listing at ${port}`);
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(
      `The script uses approximately ${Math.round(used * 100) / 100} MB`
    );
  });
  server.on("error", (error) => console.error(error.stack));
})();
