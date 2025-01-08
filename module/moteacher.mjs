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
                SELECT teacher_id, lesson_name
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

    async getcomment(teacherId) {
        try {
            const query = `
                SELECT 
                    t.teacher_id, t.image, 
                    s.last_name AS student_last_name, 
                    s.first_name AS student_first_name, 
                    f.comment
                FROM public."Feedback" f
                JOIN public."Teacher" t ON f.teacher_id = t.teacher_id
                JOIN public."Student" s ON f.student_id = s.student_id
                WHERE t.teacher_id = $1;
            `;
            const result = await this.client.query(query, [teacherId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
    

    async getteachingsessions(teacherId){
        try{
            const query=`
            
SELECT
    t.teacher_id,
    s.first_name ,
    s.last_name,
    t.image ,
    ses.lesson_name ,
    ses.messege 
FROM public."Sessions" ses
JOIN public."Student" s ON ses.student_id = s.student_id
JOIN public."Teacher" t ON ses.teacher_id = t.teacher_id
WHERE t.teacher_id = $1;
            `;
            const result=await this.client.query(query,[teacherId]);
            return result.rows;
        }
        catch(error){
            throw error;
        }
    }

}

