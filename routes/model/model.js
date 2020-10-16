const
    express = require('express'),
    authenticate_token = require('../middleware/authenticate_token'),
    authenticate_admin = require('../middleware/authenticate_admin');

const
    config = require('../../config'),
    knex = require('knex')(config),
    RESTAPI_TYPES = require('../enum/restapi_types')

class RouteModel {

    constructor(model_name, model_id, select_columns = [], disabled_routes = [], admin_routes = []) {
        this.model_name = model_name
        this.model_id = model_id
        this.select_columns = select_columns

        // Options GET, GET_ID, POST, PUT, DELETE
        this.disabled_routes = disabled_routes
        this.admin_routes = admin_routes

        this.model_router = express.Router()
        this.generate_default_routes()
    }

    generate_default_routes() {

        // Middleware to authenticate if user is logged in
        this.model_router.use(authenticate_token);


        if (!this.disabled_routes.includes(RESTAPI_TYPES.GET)) {

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

            // Check if this route needs admin permissions
            if (this.admin_routes.includes(RESTAPI_TYPES.PUT)) {
                this.model_router.put('/', authenticate_admin)
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