//routes/lesson.mjs

import express from 'express';
import{ moLesson} from '../module/mo.mjs';

const router = express.Router();

router.get('/', async(req, res)=>{
    try {
        const lesson=await moLesson.getteachingsessions();
        res.json(lesson);
    }
    catch(error){
        res.status(500).json({error:error.massage})
    }
});

export default router;