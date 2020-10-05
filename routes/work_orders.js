const 
    RouteModel = require("./model/model"),
    MODEL_NAME = 'work_orders',
    MODEL_ID = 'work_order_id',
    work_order_model = new RouteModel(MODEL_NAME, MODEL_ID)


module.exports = work_order_model.model_router;