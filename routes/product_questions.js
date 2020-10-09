const 
    RESTAPI_TYPES = require("./enum/restapi_types").RESTAPI_TYPES,
    RouteModel = require("./model/model"),
    MODEL_NAME = 'product_questions',
    MODEL_ID = 'product_question_id',
    ADMIN_ROUTES = [
        RESTAPI_TYPES.POST,
        RESTAPI_TYPES.PUT,
        RESTAPI_TYPES.DELETE
    ],
    product_question_model = new RouteModel(MODEL_NAME, MODEL_ID, undefined, undefined, ADMIN_ROUTES)


module.exports = product_question_model.model_router;