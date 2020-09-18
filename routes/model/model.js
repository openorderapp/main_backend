const express = require('express')

const
    config = require('../../config'),
    knex = require('knex')(config);

class RouteModel{
    
    constructor(model_name, model_id) {
        this.model_name = model_name
        this.model_id = model_id
        this.model_router = express.Router()

        this.generate_default_routes()
    }

    generate_default_routes() {
        this.model_router.get('/', async(req, res) => {
            try{
                const query_result = await knex(this.model_name).select()
                res.json(query_result)
            }catch(err){
                res.status(500).json({message:err.message})
            }
        })

        this.model_router.get('/:' + this.model_id, async(req, res) => {
            try{
                const query_result = (await knex(this.model_name).where(this.model_id, req.params[this.model_id]).select())[0];
                if(query_result == null){
                    return res.status(404).json({message:`Can not find ${this.model_name}!`});
                }
                res.json(query_result);
            }catch(err){
                res.status(500).json({message:err.message});
            }
        });

        this.model_router.post('/', async(req, res) => {
            try{
                const insert_payload = {...req.body};
                await knex(this.model_name).insert(insert_payload);
                res.status(201).json({message:`Create ${this.model_name} successfully!`});
            }catch(err){
                res.status(400).json({message:err.message});
            }
        });

        this.model_router.put('/:' + this.model_id, async(req, res) => {
            try{
                const update_payload = {...req.body};
                await knex(this.model_name).where(this.model_id, req.params[this.model_id]).update(update_payload);
                res.json({message:`Updated ${this.model_name} successfully!`});
            }catch(err){
                res.status(500).json({message:err.message});
            }
        });

        this.model_router.delete('/:' + this.model_id, async(req, res) => {
            try{
                await knex(this.model_name).where(this.model_id, req.params[this.model_id]).delete();
                res.json({message: `Deleted ${this.model_id} successful!`});
            }catch(err){
                res.status(500).json({message:err.message});
            }
        });
    }
}

module.exports = RouteModel