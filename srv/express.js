// load modules
const express = require("express");
const fesr = require("@sap/fesr-to-otel-js");

// For authentication test
const passport = require("passport");
const xsenv = require("@sap/xsenv");
xsenv.loadEnv();
const JWTStrategy = require("@sap/xssec").JWTStrategy;
const services = xsenv.getServices({ xsuaa: { tags: "xsuaa" } });
const jwtDecode = require("jwt-decode");
passport.use(new JWTStrategy(services.xsuaa));
const { executeHttpRequest } = require("@sap-cloud-sdk/http-client");

// config
const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 4004;

function getDestination(req) {
  return {
    destinationName: process.env.DESTINATION || "SAP_ABAP_BACKEND",
    jwt: getJWT(req),
  };
}

function getJWT(req) {
  const jwt = /^Bearer (.*)$/.exec(req.headers.authorization)[1];
  return jwt;
}

(async () => {
  // create new app
  const app = express();
  fesr.registerFesrEndpoint(app);
  // Authentication using JWT
  await app.use(passport.initialize());
  await app.use(passport.authenticate("JWT", { session: false }));

  await app.get("/api/userInfo", function (req, res) {
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(req.user));
  });

  await app.get("/api/jwt", function (req, res) {
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify({ JWT: getJWT(req) }));
  });
  await app.get("/api/jwtdecode", function (req, res) {
    if (!req.user) {
      res.statusCode = 403;
      res.end(`Missing JWT Token`);
    } else {
      res.statusCode = 200;
      res.header("Content-Type", "application/json");
      res.end(`${JSON.stringify(jwtDecode(getJWT(req)))}`);
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
        getDestination(req),
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
