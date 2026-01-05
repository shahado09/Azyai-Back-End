const Order = require('../models/order');
const express = require('express');
const router= express.Router()

router.post('/', async(req,res)=>{
    try{
        console.log(req.user)
        req.body.user = req.user
        const createdOrder = await Order.create(req.body);
        res.status(201).json(createdOrder)
    }catch(error){
        res.status(500).json({error: error.message})
        console.log(error)
    }
})

router.get('/', async(req,res)=>{
    try{

        const foundOrders = await Order.find();
        res.status(200).json(foundOrders);
        
    }catch(error){
      res.status(500).json({error: error.message})
        console.log(error)   
    }
})

router.get('/:orderId', async(req,res)=>{
        try{
    
            console.log(req.params.orderId)
        const foundOrder = await Order.findById(req.params.orderId);
        if (!foundOrder){
            res.status(404);
            throw new Error('Order not found!');
        }
        res.status(200).json(foundOrder);
        }catch(error){
             if (res.statusCode === 404) {
                 res.json({ err: err.message });
            } else {
            res.status(500).json({error: error.message})
        
        }}
    })

router.delete('/:orderId', async(req,res)=>{
        try{
 
        const deleteOrder = await Order.findByIdAndDelete(req.params.orderId);
        if (!deleteOrder){
            res.status(404);
            throw new Error('Order not found!');
        }
        res.status(200).json(deleteOrder);
        }catch(error){
             if (res.statusCode === 404) {
                 res.json({ err: err.message });
            } else {
            res.status(500).json({error: error.message})
        
        }}
    })

router.put('/:orderId', async(req,res)=>{
    try{
        const updatedOrder = await Order.findByIdAndUpdate(req.params.orderId)
        if (!updatedOrder){
            res.status(404);
            throw new Error('Order not found!');
        }
        res.status(200).json(updatedOrder);
    }catch(error){
            if (res.statusCode === 404) {
                 res.json({ err: err.message });
            } else {
            res.status(500).json({error: error.message})
            }
    }
})




module.exports = router