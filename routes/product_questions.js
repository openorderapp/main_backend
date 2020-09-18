const 
    RouteModel = require("./model/model"),
    MODEL_NAME = 'product_questions',
    MODEL_ID = 'product_question_id',
    product_question_model = new RouteModel(MODEL_NAME, MODEL_ID)


module.exports = product_question_model.model_router;