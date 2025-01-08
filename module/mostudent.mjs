
export default class Mostudent {
    constructor(dbClient) {
      this.client = dbClient;
    }
  
    validatePassword(password) {
      const minLength = 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasNumber = /\d/.test(password);
  
      if (password.length < minLength) {
        return { isValid: false, error: "Нууц үг 8-аас багагүй тэмдэгттэй байх ёстой" };
      }
      if (!hasUpperCase) {
        return { isValid: false, error: "Нууц үг дор хаяж нэг том үсэг агуулсан байх ёстой" };
      }
      if (!hasNumber) {
        return { isValid: false, error: "Нууц үг дор хаяж нэг тоо агуулсан байх ёстой" };
      }
  
      return { isValid: true };
    }
  
    async registerStudent(studentData) {
      const { first_name, last_name, email, password, phone } = studentData;
  
      const passwordValidation = this.validatePassword(password);
      if (!passwordValidation.isValid) {
        return { success: false, error: passwordValidation.error };
      }
  
      try {
        const query = `
          INSERT INTO "Teacher" (first_name, last_name, email, password, phone)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING teacher_id;
        `;
        const values = [first_name, last_name, email, password, phone];
        const result = await this.client.query(query, values);
        
        return {
          success: true,
          message: "Сурагчийг амжилттай бүртгэлээ",
          studentId: result.rows[0].student_id
        };
      } catch (error) {
        if (error.code === '23505') {
          return { success: false, error: "И-мэйл бүртгэлтэй байна" };
        }
        throw error;
      }
    }
  

    async loginStudent(email, password) {
      try {
        const query = `
          SELECT *
          FROM "Teacher"
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