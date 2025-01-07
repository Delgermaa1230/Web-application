export default class Mostudent {
    constructor(dbClient) {
        this.client = dbClient;
    }

    async registerStudent(studentData) {
        const { first_name, last_name, email, password, phone } = studentData;

        try {
            const query = `
                INSERT INTO "Student" (first_name, last_name, email, password, phone)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING student_id;
            `;
            const values = [first_name, last_name, email, password, phone];

            const result = await this.client.query(query, values);
            return { success: true, message: "Сурагчийг амжилттай бүртгэлээ", studentId: result.rows[0].student_id };
        } catch (error) {
            if (error.code === '23505') { // Duplicate email
                return { success: false, error: "И-мэйл бүртгэлтэй байна" };
            }
            throw error;
        }
    }

    async loginStudent(email, password) {
        try {
            const query = `
                SELECT student_id, first_name, last_name, email
                FROM "Student"
                WHERE email = $1 AND password = $2;
            `;
            const values = [email, password];
            const result = await this.client.query(query, values);

            if (result.rows.length > 0) {
                return { success: true, student: result.rows[0] };
            } else {
                return { success: false, error: "И-мэйл эсвэл нууц үг буруу байна" };
            }
        } catch (error) {
            throw error;
        }
    }
}

