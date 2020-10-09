
// Middleware which authenticates is this user admin or not 
const authenticate_admin = (req, res, next) => {
    try {
        if (!req.employee) return res.sendStatus(422);
        if (!req.employee.admin) return res.sendStatus(403);

        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = authenticate_admin