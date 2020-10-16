const 
    RouteModel = require("./model/model"),
    MODEL_NAME = 'customers',
    MODEL_ID = 'customer_id',
    customer_model = new RouteModel(MODEL_NAME, MODEL_ID)

module.exports = customer_model.model_router;
