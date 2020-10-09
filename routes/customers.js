const 
    RESTAPI_TYPES = require("./enum/restapi_types").RESTAPI_TYPES,
    ALL_RESTAPI_TYPES = require("./enum/restapi_types").ALL_RESTAPI_TYPES,
    RouteModel = require("./model/model"),
    MODEL_NAME = 'customers',
    MODEL_ID = 'customer_id',
    customer_model = new RouteModel(MODEL_NAME, MODEL_ID)

// You can add more custom routes here
// using the customer_model.model_router property


module.exports = customer_model.model_router;
