const
    WRITE_RESTAPI_TYPES = require("./enum/restapi_types").WRITE_RESTAPI_TYPES,
    RouteModel = require("./model/model"),
    MODEL_NAME = 'products',
    MODEL_ID = 'product_id',
    OPTIONS = {
        admin_routes: WRITE_RESTAPI_TYPES
    }
    product_model = new RouteModel(MODEL_NAME, MODEL_ID, OPTIONS)


module.exports = product_model.model_router;