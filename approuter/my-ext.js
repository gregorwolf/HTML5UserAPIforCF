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
