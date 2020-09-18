const 
    express = require('express'),
    swagger_ui = require('swagger-ui-express'),
    swagger_document = require('./swagger.json');

const 
    app = express(),
    port = 3000,
    swagger_options = {
        explorer: true
    };


const
    customers = require('./routes/customers'),
    employees = require('./routes/employees'),
    events = require('./routes/events'),
    product_questions = require('./routes/product_questions'),
    products = require('./routes/product'),
    work_order_event_comments = require('./routes/work_order_event_comments'),
    work_order_events = require('./routes/work_order_events'),
    work_order_product_responses = require('./routes/work_order_product_responses'),
    work_order_products = require('./routes/work_order_products'),
    work_orders = require('./routes/work_orders');

app
    .use('/api-docs', swagger_ui.serve, swagger_ui.setup(swagger_document, swagger_options))
    .use(express.json())
    .use('/customers', customers)
    .use('/employees', employees)
    .use('/events', events)
    .use('/product_questions', product_questions)
    .use('/products', products)
    .use('/work_order_event_comments', work_order_event_comments)
    .use('/work_order_events', work_order_events)
    .use('/work_order_product_responses', work_order_product_responses)
    .use('/work_order_products', work_order_products)
    .use('/work_orders', work_orders);

app.listen(port, () => console.log(`Server is running on port ${port}`));