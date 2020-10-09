const
    RESTAPI_TYPES = require('./enum/restapi_types'),
    REQUIRE_ADMIN = require('./enum/require_admin'),
    RouteModel = require("./model/model"),
    MODEL_NAME = 'employees',
    MODEL_ID = 'employee_id',
    SELECT_COLUMNS = [
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
    DISABLED_ROUTES = [
        RESTAPI_TYPES.POST,
        RESTAPI_TYPES.PUT,
        RESTAPI_TYPES.DELETE
    ],
    employee_model = new RouteModel(MODEL_NAME, MODEL_ID, SELECT_COLUMNS, DISABLED_ROUTES, REQUIRE_ADMIN.REQUIRE);

module.exports = employee_model.model_router;