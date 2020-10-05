const 
    RouteModel = require("./model/model"),
    MODEL_NAME = 'work_order_event_comments',
    MODEL_ID = 'work_order_event_comment_id',
    work_order_event_comment_model = new RouteModel(MODEL_NAME, MODEL_ID)


module.exports = work_order_event_comment_model.model_router;