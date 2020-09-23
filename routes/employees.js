const
    express = require('express'),
    config = require('../config'),
    knex = require('knex')(config),
    { register, login, authenticateToken } = require('../auth/employee_auth');

const
    MODEL_NAME = 'employees',
    MODEL_ID = 'employee_id',
    router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
        const query_result = (await knex(MODEL_NAME).where(MODEL_ID, req.employee.id).select())[0];
        res.json(query_result);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.post('/register', register);

router.post('/login', login);

module.exports = router;