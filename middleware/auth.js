let jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

const routeAuthorization = (req, res, next) => {
    if (
        req.headers.authorization == undefined &&
        typeof req.headers.authorization == "object"
    ) {
        res.send({ status: "error", message: "Un authorization error." });
        return;
    }
    jwt.verify(
        req.headers.authorization,
        PRIV_KEY,
        function(err, decoded) {
            if (err) {
                console.log(req.headers.authorization)
                res.send({
                    status: "error",
                    message: "Un authorization error.",
                    json: err,
                });
                return;
            } else {
                console.log(decoded);
                next();
            }
        }
    );
};
module.exports = routeAuthorization;