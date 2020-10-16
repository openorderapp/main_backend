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

    generate_default_routes() {

        if (!this.disabled_routes.includes(RESTAPI_TYPES.GET)) {

            // Check if route needs user to be logged in
            if (this.authenticated_routes.includes(RESTAPI_TYPES.GET)) {
                this.model_router.get('/', authenticate_token)
            }

            // Check if this route needs admin permissions
            if (this.admin_routes.includes(RESTAPI_TYPES.GET)) {
                this.model_router.get('/', authenticate_admin)
            }

            this.model_router.get('/', async (req, res) => {
                try {
                    const query_result = await knex(this.model_name).select(this.select_columns)
                    res.json(query_result)
                } catch (err) {
                    res.status(500).json({ message: err.message })
                }
            })
        }

        if (!this.disabled_routes.includes(RESTAPI_TYPES.GET_ID)) {

            // Check if route needs user to be logged in
            if (this.authenticated_routes.includes(RESTAPI_TYPES.GET_ID)) {
                this.model_router.get('/:' + this.model_id, authenticate_token)
            }

            // Check if this route needs admin permissions
            if (this.admin_routes.includes(RESTAPI_TYPES.GET_ID)) {
                this.model_router.get('/:' + this.model_id, authenticate_admin)
            }

            this.model_router.get('/:' + this.model_id, async (req, res) => {
                try {
                    const query_result = (await knex(this.model_name).where(this.model_id, req.params[this.model_id]).select(this.select_columns))[0];
                    if (query_result == null) {
                        return res.status(404).json({ message: `Can not find ${this.model_name}!` });
                    }
                    res.json(query_result);
                } catch (err) {
                    res.status(500).json({ message: err.message });
                }
            });
        }

        if (!this.disabled_routes.includes(RESTAPI_TYPES.POST)) {

            // Check if route needs user to be logged in
            if (this.authenticated_routes.includes(RESTAPI_TYPES.POST)) {
                this.model_router.post('/', authenticate_token)
            }

            // Check if this route needs admin permissions
            if (this.admin_routes.includes(RESTAPI_TYPES.POST)) {
                this.model_router.post('/', authenticate_admin)
            }

            this.model_router.post('/', async (req, res) => {
                try {
                    const insert_payload = { ...req.body };
                    await knex(this.model_name).insert(insert_payload);
                    res.status(201).json({ message: `Create ${this.model_name} successfully!` });
                } catch (err) {
                    res.status(400).json({ message: err.message });
                }
            });
        }

        if (!this.disabled_routes.includes(RESTAPI_TYPES.PUT)) {

            // Check if route needs user to be logged in
            if (this.authenticated_routes.includes(RESTAPI_TYPES.PUT)) {
                this.model_router.put('/:' + this.model_id, authenticate_token)
            }

            // Check if this route needs admin permissions
            if (this.admin_routes.includes(RESTAPI_TYPES.PUT)) {
                this.model_router.put('/:' + this.model_id, authenticate_admin)
            }

            this.model_router.put('/:' + this.model_id, async (req, res) => {
                try {
                    const update_payload = { ...req.body };
                    await knex(this.model_name).where(this.model_id, req.params[this.model_id]).update(update_payload);
                    res.json({ message: `Updated ${this.model_name} successfully!` });
                } catch (err) {
                    res.status(500).json({ message: err.message });
                }
            });
        }

        if (!this.disabled_routes.includes(RESTAPI_TYPES.DELETE)) {

            // Check if route needs user to be logged in
            if (this.authenticated_routes.includes(RESTAPI_TYPES.DELETE)) {
                this.model_router.delete('/:' + this.model_id, authenticate_token)
            }

            // Check if this route needs admin permissions
            if (this.admin_routes.includes(RESTAPI_TYPES.DELETE)) {
                this.model_router.delete('/:' + this.model_id, authenticate_admin)
            }

            this.model_router.delete('/:' + this.model_id, async (req, res) => {
                try {
                    await knex(this.model_name).where(this.model_id, req.params[this.model_id]).delete();
                    res.json({ message: `Deleted ${this.model_id} successful!` });
                } catch (err) {
                    res.status(500).json({ message: err.message });
                }
            });
        }
    }
}

module.exports = RouteModel