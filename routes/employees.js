const
    WRITE_RESTAPI_TYPES = require('./enum/restapi_types').WRITE_RESTAPI_TYPES,
    RouteModel = require("./model/model"),
    MODEL_NAME = 'employees',
    MODEL_ID = 'employee_id',
    OPTIONS = {
        select_columns: [
            'employee_id',
            'employee_first_name',
            'employee_last_name',
            'employee_email',
            'employee_phone',
            'employee_username',
            'employee_is_admin',
            'created_at',
            'updated_at'
        ],
        disabled_routes: WRITE_RESTAPI_TYPES,
        admin_routes: WRITE_RESTAPI_TYPES,
    },
    employee_model = new RouteModel(MODEL_NAME, MODEL_ID, OPTIONS);

module.exports = employee_model.model_router;