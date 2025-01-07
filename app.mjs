//app.mjs

import express from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import teacherRouter from './routes/teacher.mjs';
import studentRoutes from './routes/student.mjs'


const app = express();
app.use(cors());
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Teacher Student API',
            version: '1.0.0',
            description: 'API documentation for Teacher Student system'
        },
    },
    apis: ['./routes/*.mjs'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/teachers', teacherRouter);
app.use('/api/students', studentRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});