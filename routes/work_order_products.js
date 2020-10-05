const 
    RouteModel = require("./model/model"),
    MODEL_NAME = 'work_order_products',
    MODEL_ID = 'work_order_product_id',
    work_order_product_model = new RouteModel(MODEL_NAME, MODEL_ID)


module.exports = work_order_product_model.model_router;