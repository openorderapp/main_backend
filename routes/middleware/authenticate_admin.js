
// Middleware which authenticates is this user admin or not 
const authenticate_admin = async (req, res, next) => {
    try {
        if (!req.employee) return res.sendStatus(401);
        if (!req.employee.admin) return res.json({ message: "Sorry, you do not have permission!" });

        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = authenticate_admin