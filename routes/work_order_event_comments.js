const 
    RESTAPI_TYPES = require("./enum/restapi_types").RESTAPI_TYPES,
    RouteModel = require("./model/model"),
    MODEL_NAME = 'work_order_event_comments',
    MODEL_ID = 'work_order_event_comment_id',
    OPTIONS = {
        admin_routes: [
            RESTAPI_TYPES.PUT,
            RESTAPI_TYPES.DELETE
        ]
    }
    work_order_event_comment_model = new RouteModel(MODEL_NAME, MODEL_ID, OPTIONS)


module.exports = work_order_event_comment_model.model_router;