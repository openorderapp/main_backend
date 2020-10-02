const
    bcryt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    request = require('request');

const
    express = require('express'),
    config = require('../config'),
    knex = require('knex')(config);

const
    MODEL_NAME = 'employees',
    MODEL_ID = 'employee_id',
    router = express.Router();

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

// Middleware which authenticates captcha token
const authenticate_captcha = (req, res, next) => {
    const captcha_secretkey = config.captcha_secretkey;
    const captcha = req.body.captcha;

    if (!captcha)
        return res.json({ message: "Please check captcha!" });

    const verity_url = `https://www.google.com/recaptcha/api/siteverify?secret=${captcha_secretkey}&response=${captcha}`;
    request(verity_url, (err, respond, body) => {
        body = JSON.parse(body);

        if (err) {
            return res.json({ message: err.message });
        }

        if (!body.success || body.score < 0.4) {
            return res.json({ message: "Failed captcha verification", score: body.score });
        }

        //return res.json({ message: "Captcha passed", score: body.score });
        next();
    });

}

// Function which finds employee by email or username
const find_by_email_or_username_or_phone = async (req) => {
    try {
        if (!req.body.username)
            return null;

        if (req.body.email && req.body.phone) {

            const existing_employee = (await knex(MODEL_NAME)
                .where("employee_username", req.body.username)
                .orWhere("employee_email", req.body.email)
                .orWhere("employee_phone", req.body.phone)
                .select())[0];

            return existing_employee;

        } else {

            const existing_employee = (await knex(MODEL_NAME)
                .where("employee_username", req.body.username)
                .orWhere("employee_email", req.body.username)
                .select())[0];

            return existing_employee;
        }

    } catch (err) {
        return null;
    }
}

// Function which inserts new record to database
const create_employee = async (employee) => {
    try {
        await knex(MODEL_NAME).insert(employee);
    } catch (err) {
        return err;
    }
}

const register = async (req, res) => {
    try {
        // TODO: 
        // This request should be in a separate function
        // Should be called find_by_email_or_user_name
        // -> Please see find_by_email_or_username_or_phone
        const existing_employee = await find_by_email_or_username_or_phone(req);

        if (existing_employee)
            // We should never leak the fact that an email address or user name is in our system.
            // Unfortunately for registering users this is an impossible issue to avoid.
            // TODO:
            // Add a recaptcha to slow down data leakage.
            // -> Please see authenticate_captcha middleware

            // TODO:
            // We should let the user know their email is taken or their user name.
            return res.json({ message: "Employee with same user name, phone or email address already exists!" });

        const salt = await bcryt.genSalt(10);
        const hash_password = await bcryt.hash(req.body.password, salt);
        const employee = {
            employee_first_name: req.body.first_name,
            employee_last_name: req.body.last_name,
            employee_email: req.body.email,
            employee_phone: req.body.phone,
            employee_username: req.body.username,
            employee_password_hash: hash_password,
            employee_password_salt: salt,
            employee_is_admin: true
        };

        // TODO: 
        // This request should be a separate function
        // Should be called create
        // -> Please see create_employee
        await create_employee(employee);
        res.status(201).json({ message: `Registered successfully!` });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const login = async (req, res) => {
    try {
        // TODO: 
        // This request should be in a separate function
        // Should be called find_by_email_or_user_name
        // -> Please see find_by_email_or_username_or_phone
        const existing_employee = await find_by_email_or_username_or_phone(req);

        // Here I noticed we return different messages depending on 
        // account existing or not. This can cause data leakage, we should
        // Always respond with "Please review your credentials and try again"
        // I like how you have it split up thought. This will be useful for our 
        // internal logging in the future.
        // TODO:
        // If the account doesn't exist or wrong password respond with an
        // incorrect credentials message.
        // -> Have set message to "Please review your credentials and try again!"
        if (!existing_employee)
            return res.json({ message: "Please review your credentials and try again!" });

        if (!(await bcryt.compare(req.body.password, existing_employee.employee_password_hash)))
            return res.json({ message: "Please review your credentials and try again!" })

        const token = jwt.sign({ id: existing_employee.employee_id }, config.access_token_secret);
        res.header("auth-token", token).send({ "token": token });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

router.get('/', authenticate_token, async (req, res) => {
    try {
        const query_result = (await knex(MODEL_NAME).where(MODEL_ID, req.employee.id).select())[0];
        res.json(query_result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.post('/register', authenticate_captcha, register);

router.post('/login', authenticate_captcha, login);

module.exports = router
