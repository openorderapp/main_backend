const 
    RouteModel = require("./model/model"),
    MODEL_NAME = 'products',
    MODEL_ID = 'product_id',
    product_model = new RouteModel(MODEL_NAME, MODEL_ID)


module.exports = product_model.model_router;