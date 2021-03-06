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
    router = express.Router(),
    authenticate_token = require('./middleware/authenticate_token');


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
// TODO:
// Update this function so that it's parameters are email, username, and phone_number
// Validation that these values exist in the request should be done before this function
const find_by_email_or_username_or_phone = async (username, email, phone) => {
    try {

        let
            first_where_clause = true,
            base_query = knex(MODEL_NAME)

        if (username) {
            first_where_clause = stacking_where_mutator(base_query, "employee_username", username, first_where_clause, true)
        }

        if (email) {
            first_where_clause = stacking_where_mutator(base_query, "employee_email", email, first_where_clause, true)
        }

        if (phone) {
            first_where_clause = stacking_where_mutator(base_query, "employee_phone", phone, first_where_clause, true)
        }

        const matching_employees = await base_query.select()

        return matching_employees[0]

    } catch (err) {
        return null;
    }
}

const stacking_where_mutator = (base_query, column, value, first, or) => {
    if (first) {
        base_query.where(column, value)
        return false
    } else {
        if (or) {
            base_query.orWhere(column, value)
        } else {
            base_query.andWhere(column, value)
        }
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

// Function which creates access token
const create_access_token = (existing_employee) => {
    const access_token = jwt.sign({ id: existing_employee.employee_id, admin: existing_employee.employee_is_admin }, config.access_token_secret, { expiresIn: config.access_token_expire_in });
    return access_token;
}

// Function which adds refresh token to database
const add_refresh_token = async (refresh_token) => {
    try {
        const TABLE_NAME = 'refresh_tokens';
        await knex(TABLE_NAME).insert(refresh_token);
    } catch (err) {
        return err;
    }
}

// Function which finds refresh token on database
const find_refresh_token = async (refresh_token) => {
    try {
        const TABLE_NAME = 'refresh_tokens';
        const COLUMN_NAME = 'refresh_token';
        const matching_refresh_tokens = await knex(TABLE_NAME).where(COLUMN_NAME, refresh_token).select();
        return matching_refresh_tokens[0];
    } catch (err) {
        return null;
    }
}

// Function which delete refresh token on database
const delete_refresh_token = async (refresh_token) => {
    try {
        const TABLE_NAME = 'refresh_tokens';
        const COLUMN_NAME = 'refresh_token';
        await knex(TABLE_NAME).where(COLUMN_NAME, refresh_token).delete();
    } catch (err) {
        return err;
    }
}

const register = async (req, res) => {
    try {

        // Validation Parameters
        if (!(
            req.body.first_name &&
            req.body.last_name &&
            req.body.email &&
            req.body.phone &&
            req.body.username &&
            req.body.password &&
            req.body.admin
        ))
            return res.json({ message: "Pleases complete the registration form!" });

        const existing_employee = await find_by_email_or_username_or_phone(req.body.username, req.body.email, req.body.phone);

        if (existing_employee)
            // We should never leak the fact that an email address or user name is in our system.
            // Unfortunately for registering users this is an impossible issue to avoid.
            // TODO:
            // Add a recaptcha to slow down data leakage.
            // -> Please see authenticate_captcha middleware

            // TODO:
            // We should let the user know their email is taken or their user name.
            return res.json({ message: "Employee with same username, phone or email address already exists!" });

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
            employee_is_admin: req.body.admin === "true"
        };

        await create_employee(employee);
        res.status(201).json({ message: `Registered successfully!` });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const login = async (req, res) => {
    try {

        // Validation Parameters
        if (!(req.body.username && req.body.password))
            return res.json({ message: "Pleases complete the log in form!" });

        const existing_employee = await find_by_email_or_username_or_phone(req.body.username, req.body.username, null);

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

        const access_token = create_access_token(existing_employee);
        const refresh_token = jwt.sign({ id: existing_employee.employee_id, admin: existing_employee.employee_is_admin }, config.refresh_token_secret);
        await add_refresh_token({ employee_id: existing_employee.employee_id, refresh_token: refresh_token });

        res.json({ "access_token": access_token, "refresh_token": refresh_token });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const logout = async (req, res) => {
    await delete_refresh_token(req.body.refresh_token);
    res.sendStatus(204);
}

const generate_new_token = async (req, res) => {
    const refresh_token = req.body.refresh_token;
    if (!refresh_token) return res.sendStatus(401);

    const existing_refresh_token = await find_refresh_token(refresh_token);
    if (!existing_refresh_token) return res.sendStatus(403);

    jwt.verify(refresh_token, config.refresh_token_secret, (err, existing_employee) => {
        if (err) return res.sendStatus(403);
        const access_token = create_access_token(existing_employee);
        res.json({ "access_token": access_token });
    });

}

router.get('/', authenticate_token, async (req, res) => {
    try {
        const query_result = (await knex(MODEL_NAME).where(MODEL_ID, req.employee.id).select())[0];
        res.json(query_result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.post('/generate_new_token', generate_new_token);

router.post('/register', authenticate_captcha, register);

router.post('/login', authenticate_captcha, login);

router.delete('/logout', logout);

module.exports = router
