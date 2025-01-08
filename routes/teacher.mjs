//routes/teacher.mjs

import express from 'express';
import { moTeacher } from '../module/mo.mjs';

const router = express.Router();

/**
 * @swagger
 * /api/teachers/{id}:
 *   get:
 *     summary: Get teacher details by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Teacher details retrieved successfully
 */
router.get('/:id', async (req, res) => {
    try {
        const teacherDetails = await moTeacher.getTeacherDetails(req.params.id);
        const teacherLessons = await moTeacher.getTeacherLessons(req.params.id);
        res.json({ teacher: teacherDetails[0], lessons: teacherLessons });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



/**
 * @swagger
 * /api/teachers:
 *   get:
 *     summary: Get all teachers with their lessons
 *     responses:
 *       200:
 *         description: List of all teachers with their lessons
 */
router.get('/', async (req, res) => {
    try {
        const teachers = await moTeacher.getAllTeachers();

        // Багш бүрийн хичээл болон сэтгэгдлийг нэгтгэх
        const teachersWithDetails = await Promise.all(
            teachers.map(async (teacher) => {
                const teacherLessons = await moTeacher.getTeacherLessons(teacher.teacher_id);
                const teacherComments = await moTeacher.getcomment(teacher.teacher_id);
                const teachersession=await moTeacher.getteachingsessions(teacher.teacher_id);
                return {
                    ...teacher,
                    lessons: teacherLessons,
                    feedback: teacherComments,
                    teachingSessions: teachersession,
                };
            })
        );

        res.json(teachersWithDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/**
 * @swagger
 * /api/teachers/search:
 *   get:
 *     summary: Search teachers
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', async (req, res) => {
    try {
        const teachers = await moTeacher.searchTeachers(req.query.q);
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;