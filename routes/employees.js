const 
    RouteModel = require("./model/model"),
    MODEL_NAME = 'employees',
    MODEL_ID = 'employee_id',
    SELECT_COLUMNS = [
        'employee_id',
        'employee_first_name',
        'employee_last_name',
        'employee_email',
        'employee_phone',
        'employee_user_name',
        'employee_is_admin',
        'created_at',
        'updated_at'
    ],
    DISABLED_ROUTES = [
        'POST'
    ]
    employee_model = new RouteModel(MODEL_NAME, MODEL_ID, SELECT_COLUMNS, DISABLED_ROUTES)

module.exports = employee_model.model_router;