module.exports = {
  insertMiddleware: {
    first: [
      function logRequest(req, res, next) {
        console.log("Got request %s %s %s", req.method, req.url, req.headers);
        return next();
      },
    ],
    beforeRequestHandler: [
      {
        path: "/sap",
        handler: function sapClientMiddleware(req, res, next) {
          if (req.user && req.user.scopes && Array.isArray(req.user.scopes)) {
            const scopePrefix = "HTML5UserAPIforCF!t5585.Client";
            const matchingScope = req.user.scopes.find(
              (scope) =>
                typeof scope === "string" && scope.startsWith(scopePrefix)
            );

            if (matchingScope) {
              const clientNumber = matchingScope.substring(scopePrefix.length);
              if (clientNumber) {
                req.headers["sap-client"] = clientNumber;
                console.log("Set sap-client header to: %s", clientNumber);
              }
            }
          }
          return next();
        },
      },
      {
        path: "/services/userapi/currentUser",
        handler: function myMiddleware(req, res, next) {
          if (!req.user) {
            res.statusCode = 403;
            res.end(`Missing JWT Token`);
          } else {
            res.statusCode = 200;
            res.setHeader("Content-type", "application/json");
            res.end(JSON.stringify(req.user));
          }
        },
      },
    ],
  },
};
