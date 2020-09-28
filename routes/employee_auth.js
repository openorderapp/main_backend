const
    bcryt = require('bcrypt'),
    jwt = require('jsonwebtoken');

const
    express = require('express'),
    config = require('../config'),
    knex = require('knex')(config);

const
    MODEL_NAME = 'employees',
    MODEL_ID = 'employee_id',
    router = express.Router();

const register = async (req, res) => {
    try {

        // TODO: 
        // This request should be in a separate function
        // Should be called find_by_email_or_user_name
        const existing_employee = (await knex(MODEL_NAME)
            .where("employee_user_name", req.body.employee_user_name)
            .orWhere("employee_email", req.body.employee_email)
            .select())[0];

        if (existing_employee != null)
            // We should never leak the fact that an email address or user name is in our system.
            // Unfortunately for registering users this is an impossible issue to avoid.
            // TODO:
            // Add a recaptcha to slow down data leakage.

            // TODO:
            // We should let the user know their email is taken or their user name.
            return res.json({ message: "Employee with same user name or email address already exists!" });

        const salt = await bcryt.genSalt(10);
        const hash_password = await bcryt.hash(req.body.password, salt);
        const employee = {
            employee_first_name: req.body.employee_first_name,
            employee_last_name: req.body.employee_last_name,
            employee_email: req.body.employee_email,
            employee_phone: req.body.employee_phone,
            employee_user_name: req.body.employee_user_name,
            employee_password_hash: hash_password,
            employee_password_salt: salt,
            employee_is_admin: true
        };

        // TODO: 
        // This request should be a separate function
        // Should be called create
        await knex(MODEL_NAME).insert(employee);
        res.status(201).json({ message: `Registered successfully!` });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const login = async (req, res) => {
    try {
        const user_name = req.body.user_name;

        // TODO: 
        // This request should be in a separate function
        // Should be called find_by_email_or_user_name
        const employee = (await knex(MODEL_NAME)
            .where("employee_user_name", user_name)
            .orWhere("employee_email", user_name)
            .select())[0];

        // Here I noticed we return different messages depending on 
        // account existing or not. This can cause data leakage, we should
        // Always respond with "Please review your credentials and try again"
        // I like how you have it split up thought. This will be useful for our 
        // internal logging in the future.
        // TODO:
        // If the account doesn't exist or wrong password respond with an
        // incorrect credentials message.
        if (employee == null)
            return res.json({ message: "Account doesn't existed!" });

        if (!(await bcryt.compare(req.body.password, employee.employee_password_hash)))
            return res.json({ message: "Wrong password!" })

        const token = jwt.sign({ id: employee.employee_id }, config.access_token_secret);
        res.header("auth-token", token).send({ "token": token });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const authenticate_token = async (req, res, next) => {
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
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    next();
}

router.get('/', authenticate_token, async (req, res) => {
    try {
        const query_result = (await knex(MODEL_NAME).where(MODEL_ID, req.employee.id).select())[0];
        res.json(query_result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.post('/register', register);

router.post('/login', login);

module.exports = router
