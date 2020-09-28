const 
    RouteModel = require("./model/model"),
    MODEL_NAME = 'employees',
    MODEL_ID = 'employee_id',
    employee_model = new RouteModel(MODEL_NAME, MODEL_ID)

module.exports = employee_model.model_router;