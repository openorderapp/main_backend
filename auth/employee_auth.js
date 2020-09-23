require('dotenv').config();

const
    bcryt = require('bcrypt'),
    jwt = require('jsonwebtoken');

const
    MODEL_NAME = 'employees',
    config = require('../config'),
    knex = require('knex')(config);

const register = async (req, res) => {
    try {
        const existedEmployee = (await knex(MODEL_NAME)
            .where("employee_user_name", req.body.employee_user_name)
            .orWhere("employee_email", req.body.employee_email)
            .select())[0];

        if (existedEmployee != null)
            return res.json({ message: "Employee which has same user name or email address already existed!" });

        const salt = await bcryt.genSalt(10);
        const hashPassword = await bcryt.hash(req.body.password, salt);
        const employee = {
            employee_first_name: req.body.employee_first_name,
            employee_last_name: req.body.employee_last_name,
            employee_email: req.body.employee_email,
            employee_phone: req.body.employee_phone,
            employee_user_name: req.body.employee_user_name,
            employee_password_hash: hashPassword,
            employee_password_salt: salt,
            employee_is_admin: true
        };

        await knex(MODEL_NAME).insert(employee);
        res.status(201).json({ message: `Register successfully!` });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const login = async (req, res) => {
    try {
        const userName = req.body.userName;
        const employee = (await knex(MODEL_NAME)
            .where("employee_user_name", userName)
            .orWhere("employee_email", userName)
            .select())[0];

        if (employee == null)
            return res.json({ message: "Account doesn't existed!" });

        if (!(await bcryt.compare(req.body.password, employee.employee_password_hash)))
            return res.json({ message: "Wrong password!" })

        const token = jwt.sign({ id: employee.employee_id }, process.env.ACCESS_TOKEN_SECRET);
        res.header("auth-token", token).send({ "token": token });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.sendStatus(401);
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, employee) => {
            if (err) return res.sendStatus(403);
            req.employee = employee;
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    next();
}

module.exports = {
    register,
    login,
    authenticateToken
}
