const
    jwt = require('jsonwebtoken'),
    config = require('../../config');

// Middleware which authenticates JWT token
const authenticate_token = (req, res, next) => {
    try {
        const auth_header = req.headers["authorization"];
        const token = auth_header && auth_header.split(' ')[1];

        if (!token) return res.sendStatus(401);
        jwt.verify(token, config.access_token_secret, (err, employee) => {
            // We should use 401 in both cases
            // 403 should be reserved for user attempting
            // to do an action they do not have permission for.
            // Like a non-admin employee trying to add an account.

            if (err) return res.sendStatus(401);
            req.employee = employee;
            next();
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = authenticate_token;