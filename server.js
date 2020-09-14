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
    employees = require('./routes/employees');

app
    .use('/api-docs', swagger_ui.serve, swagger_ui.setup(swagger_document, swagger_options))
    .use(express.json())
    .use('/customers', customers)
    .use('/employees', employees);

app.listen(port, () => console.log(`Server is running on port ${port}`));