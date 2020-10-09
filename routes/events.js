const 
    RouteModel = require("./model/model"),
    MODEL_NAME = 'events',
    MODEL_ID = 'event_id',
    event_model = new RouteModel(MODEL_NAME, MODEL_ID)

module.exports = event_model.model_router;