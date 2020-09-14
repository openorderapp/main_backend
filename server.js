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


app.use('/api-docs', swagger_ui.serve, swagger_ui.setup(swagger_document, swagger_options));

app.listen(port, () => console.log(`Server is running on port ${port}`));