const 
    RouteModel = require("./model/model"),
    MODEL_NAME = 'work_order_product_responses',
    MODEL_ID = 'work_order_product_response_id',
    work_order_product_response_model = new RouteModel(MODEL_NAME, MODEL_ID)


module.exports = work_order_product_response_model.model_router;