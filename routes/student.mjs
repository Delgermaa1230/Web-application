import express from 'express';
import { moStudent } from '../module/mo.mjs';

const router = express.Router();

// Сурагч бүртгэх
router.post('/', async (req, res) => {
    const studentData = req.body;

    try {
        const result = await moStudent.registerStudent(studentData);
        if (result.success) {
            res.status(201).json({ message: result.message });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error("Бүртгэл хийх явцад алдаа:", error);
        res.status(500).json({ error: "Серверийн алдаа гарлаа" });
    }
});

// Сурагч нэвтрэх
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await moStudent.loginStudent(email, password);
        if (result.success) {
            res.status(200).json({ student: result.student });
        } else {
            res.status(401).json({ error: result.error });
        }
    } catch (error) {
        console.error("Нэвтрэх явцад алдаа:", error);
        res.status(500).json({ error: "Серверийн алдаа гарлаа" });
    }
});

export default router;
