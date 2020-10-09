const 
    RESTAPI_TYPES = require("./enum/restapi_types").RESTAPI_TYPES,
    RouteModel = require("./model/model"),
    MODEL_NAME = 'work_order_products',
    MODEL_ID = 'work_order_product_id',
    OPTIONS = {
        admin_routes: [
            RESTAPI_TYPES.PUT,
            RESTAPI_TYPES.DELETE
        ]
    }
    work_order_product_model = new RouteModel(MODEL_NAME, MODEL_ID, OPTIONS)


module.exports = work_order_product_model.model_router;