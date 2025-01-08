import express from 'express';
import {moFeedback} from '../module/mo.mjs';

const router=express.Router();

router.get('/',async(req, res)=>{
    try{
        const feedback=await moFeedback.getcomment();
        res.json(feedback);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;