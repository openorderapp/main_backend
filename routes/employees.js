const 
    express = require('express'),
    router = express.Router();

const
    config = require('../config'),
    knex = require('knex')(config);

const
    MODEL_NAME = 'employees',
    MODEL_ID = 'employee_id';

//Get all the employees
router.get('/', async(req, res) => {
    try{
        const employees = await knex(MODEL_NAME).select();
        res.json(employees);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

//Get employee by id
router.get('/:' + MODEL_ID, async(req, res) => {
    try{
        const employee = (await knex(MODEL_NAME).where(MODEL_ID, req.params.employee_id).select())[0];
        if(employee == null){
            return res.status(404).json({message:'Can not find employee!'});
        }
        res.json(employee);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

//Create a employee
router.post('/', async(req, res) => {
    try{
        const employee = {...req.body};
        //Process employee here


        //
        await knex(MODEL_NAME).insert(employee);
        res.status(201).json({message:"Create employee successfully!"});
    }catch(err){
        res.status(400).json({message:err.message});
    }
});

//Update a employee
router.put('/:' + MODEL_ID, async(req, res) => {
    try{
        const employee = {...req.body};
        //Process employee here

        
        //
        await knex(MODEL_NAME).where(MODEL_ID, req.params.employee_id).update(employee);
        res.json({message:"Update successfully!"});
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

//Delete a employee
router.delete('/:' + MODEL_ID, async(req, res) => {
    try{
        await knex(MODEL_NAME).where(MODEL_ID, req.params.employee_id).delete();
        res.json({message: "Delete successful!"});
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

module.exports = router;