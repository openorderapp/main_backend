const
    express = require('express'),
    authenticate_token = require('../middleware/authenticate_token'),
    authenticate_admin = require('../middleware/authenticate_admin');

const
    config = require('../../config'),
    knex = require('knex')(config),
    RESTAPI_TYPES = require('../enum/restapi_types').RESTAPI_TYPES,
    ALL_RESTAPI_TYPES = require('../enum/restapi_types').ALL_RESTAPI_TYPES

class RouteModel {

    constructor(model_name, model_id, options = {}) {
        this.model_name = model_name
        this.model_id = model_id

        // Options GET, GET_ID, POST, PUT, DELETE
        this.disabled_routes = options.disabled_routes || []
        this.admin_routes = options.admin_routes || []
        // By default all routes require authentication
        this.authenticated_routes = options.authenticated_routes || ALL_RESTAPI_TYPES

        // If empty array select all columns
        this.select_columns = options.select_columns || []

        this.model_router = express.Router()
        this.generate_default_routes()
    }

    generate_route_path(restapi_type) {
        let route_path = '/'

        if (restapi_type === RESTAPI_TYPES.GET_ID || restapi_type === RESTAPI_TYPES.PUT || restapi_type === RESTAPI_TYPES.DELETE) {
            route_path += `:${this.model_id}`
        }

        return route_path
    }

    generate_route_method(restapi_type) {
        let route_method

        switch (restapi_type) {
            case RESTAPI_TYPES.GET_ID:
            case RESTAPI_TYPES.GET:
                route_method = this.model_router.get
                break;
            case RESTAPI_TYPES.PUT:
                route_method = this.model_router.put
                break;
            case RESTAPI_TYPES.POST:
                route_method = this.model_router.post
                break;
            case RESTAPI_TYPES.DELETE:
                route_method = this.model_router.delete
                break;
            default:
                throw 'Bad restapi_type in generate_route_config'
        }

        return route_method
    }

    generate_route_handler(restapi_type) {

        let route_handler

        switch (restapi_type) {
            case RESTAPI_TYPES.GET:
                route_handler = async (req, res) => {
                    try {
                        const query_result = await knex(this.model_name).select(this.select_columns)
                        res.json(query_result)
                    } catch (err) {
                        res.status(500).json({ message: err.message })
                    }
                }
                break;
            case RESTAPI_TYPES.GET_ID:
                route_handler = async (req, res) => {
                    try {
                        const query_result = (await knex(this.model_name).where(this.model_id, req.params[this.model_id]).select(this.select_columns))[0];
                        if (query_result == null) {
                            return res.status(404).json({ message: `Can not find ${this.model_name}!` });
                        }
                        res.json(query_result);
                    } catch (err) {
                        res.status(500).json({ message: err.message });
                    }
                }
                break;
            case RESTAPI_TYPES.POST:
                route_handler = async (req, res) => {
                    try {
                        const insert_payload = { ...req.body };
                        await knex(this.model_name).insert(insert_payload);
                        res.status(201).json({ message: `Create ${this.model_name} successfully!` });
                    } catch (err) {
                        res.status(400).json({ message: err.message });
                    }
                }
                break;
            case RESTAPI_TYPES.PUT:
                route_handler = async (req, res) => {
                    try {
                        const update_payload = { ...req.body };
                        await knex(this.model_name).where(this.model_id, req.params[this.model_id]).update(update_payload);
                        res.json({ message: `Updated ${this.model_name} successfully!` });
                    } catch (err) {
                        res.status(400).json({ message: err.message });
                    }
                }
                break;
            case RESTAPI_TYPES.DELETE:
                route_handler = async (req, res) => {
                    try {
                        await knex(this.model_name).where(this.model_id, req.params[this.model_id]).delete();
                        res.json({ message: `Deleted ${this.model_id} successful!` });
                    } catch (err) {
                        res.status(400).json({ message: err.message });
                    }
                }
                break;
            default:
                throw 'Bad restapi_type in generate_route_handler'
        }

        return route_handler

    }

    generate_route_config(restapi_type) {
        return {
            path: this.generate_route_path(restapi_type),
            method: this.generate_route_method(restapi_type),
            handler: this.generate_route_handler(restapi_type)
        }
    }

    generate_default_routes() {

        ALL_RESTAPI_TYPES.forEach(restapi_type => {

            // Skip restapi type if included in disabled_routes
            if (this.disabled_routes.includes(restapi_type)) {
                return
            }

            // Create express router method and path
            const route_config = this.generate_route_config(restapi_type)

            // Add required middleware
            // Check if route needs user to be logged in
            if (this.authenticated_routes.includes(restapi_type)) {
                route_config.method.bind(this.model_router, route_config.path, authenticate_token)()
            }

            // Check if this route needs admin permissions
            if (this.admin_routes.includes(restapi_type)) {
                route_config.method.bind(this.model_router, route_config.path, authenticate_admin)()
            }

            // Main route handler
            const route_handler = route_config.handler

            // Add route to router
            route_config.method.bind(this.model_router, route_config.path, route_handler)()

        })
    }
}

module.exports = RouteModel