const 
    RouteModel = require("./model/model"),
    MODEL_NAME = 'work_order_events',
    MODEL_ID = 'work_order_event_id',
    work_order_event_model = new RouteModel(MODEL_NAME, MODEL_ID)


module.exports = work_order_event_model.model_router;