//module/moteacher.mjs
export default class Moteacher {
    constructor(client) {
        this.client = client;
    }

    
    async getAllTeachers() {
        try {
            const query = `
                SELECT teacher_id, first_name, last_name, email,
                       description, retings, number_of_ratings, image,
                       rank, phone, mode, teacher_info, lesson_info
                FROM "Teacher"
                ORDER BY teacher_id
            `;
            const result = await this.client.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async getTeacherDetails(teacherId) {
        try {
            const query = `
                SELECT teacher_id, first_name, last_name, email, password,
                       description, retings, number_of_ratings, image,
                       rank, phone, mode, teacher_info, lesson_info
                FROM "Teacher"
                WHERE teacher_id = $1
            `;
            const result = await this.client.query(query, [teacherId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async getTeacherLessons(teacherId) {
        try {
            const query = `
                SELECT *
                FROM "Teacher_lessons"
                WHERE teacher_id = $1
            `;
            const result = await this.client.query(query, [teacherId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async searchTeachers(searchTerm) {
        try {
            const query = `
                SELECT teacher_id, first_name, last_name, rank, description
                FROM "Teacher"
                WHERE first_name ILIKE $1 
                OR last_name ILIKE $1 
                OR description ILIKE $1
            `;
            const result = await this.client.query(query, [`%${searchTerm}%`]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
}

