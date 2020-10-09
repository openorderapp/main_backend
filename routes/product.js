const
    RouteModel = require("./model/model"),
    REQUIRE_ADMIN = require('./enum/require_admin'),
    MODEL_NAME = 'products',
    MODEL_ID = 'product_id',
    product_model = new RouteModel(MODEL_NAME, MODEL_ID, [], [], REQUIRE_ADMIN.REQUIRE)


module.exports = product_model.model_router;