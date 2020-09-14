const 
    express = require('express'),
    router = express.Router();

const
    config = require('../config'),
    knex = require('knex')(config);

const
    MODEL_NAME = 'customers',
    MODEL_ID = 'customer_id';

//Get all the customers
router.get('/', async(req, res) => {
    try{
        const customers = await knex(MODEL_NAME).select();
        res.json(customers);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

//Get customer by id
router.get('/:' + MODEL_ID, async(req, res) => {
    try{
        const customer = (await knex(MODEL_NAME).where(MODEL_ID, req.params.customer_id).select())[0];
        if(customer == null){
            return res.status(404).json({message:'Can not find customer!'});
        }
        res.json(customer);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

//Create a customer
router.post('/', async(req, res) => {
    try{
        const customer = {...req.body};
        //Process customer here


        //
        await knex(MODEL_NAME).insert(customer);
        res.status(201).json({message:"Create customer successfully!"});
    }catch(err){
        res.status(400).json({message:err.message});
    }
});

//Update a customer
router.put('/:' + MODEL_ID, async(req, res) => {
    try{
        const customer = {...req.body};
        //Process customer here

        
        //
        await knex(MODEL_NAME).where(MODEL_ID, req.params.customer_id).update(customer);
        res.json({message:"Update successfully!"});
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

//Delete a customer
router.delete('/:' + MODEL_ID, async(req, res) => {
    try{
        await knex(MODEL_NAME).where(MODEL_ID, req.params.customer_id).delete();
        res.json({message: "Delete successful!"});
    }catch(err){
        res.status(500).json({message:err.message});
    }
});


module.exports = router;
