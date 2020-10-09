const
    RESTAPI_TYPES = require("./enum/restapi_types").RESTAPI_TYPES,
    RouteModel = require("./model/model"),
    MODEL_NAME = 'products',
    MODEL_ID = 'product_id',
    ADMIN_ROUTES = [
        RESTAPI_TYPES.POST,
        RESTAPI_TYPES.PUT,
        RESTAPI_TYPES.DELETE
    ],
    product_model = new RouteModel(MODEL_NAME, MODEL_ID, undefined, undefined, ADMIN_ROUTES)


module.exports = product_model.model_router;