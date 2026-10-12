
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);

async function hashPassword(password) {
      const salt = randomBytes(16).toString('hex');
      const hash = (await scrypt(password, salt, 64)).toString('hex');
      return `scrypt:${salt}:${hash}`;
}

async function verifyPassword(password, storedPassword) {
      if (typeof storedPassword !== 'string') return false;
      if (!storedPassword.startsWith('scrypt:')) return password === storedPassword;
      const [, salt, storedHash] = storedPassword.split(':');
      if (!salt || !storedHash || !/^[0-9a-f]{128}$/.test(storedHash)) return false;
      const candidate = await scrypt(password, salt, 64);
      return timingSafeEqual(candidate, Buffer.from(storedHash, 'hex'));
}

export default class Mostudent {
    constructor(dbClient) {
      this.client = dbClient;
    }
  
    validatePassword(password) {
      const minLength = 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasNumber = /\d/.test(password);
  
      if (typeof password !== 'string' || password.length < minLength) {
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
        const values = [first_name, last_name, email, await hashPassword(password), phone];
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
          WHERE email = $1;
        `;
        if (typeof email !== 'string' || typeof password !== 'string') {
          return { success: false, error: 'Invalid email or password' };
        }
        const result = await this.client.query(query, [email]);
  
        const account = result.rows[0];
        if (account && await verifyPassword(password, account.password)) {
          if (!account.password.startsWith('scrypt:')) {
            await this.client.query('UPDATE "Teacher" SET password = $1 WHERE teacher_id = $2', [await hashPassword(password), account.teacher_id]);
          }
          const { password: _password, ...student } = account;
          return { success: true, student };
        } else {
          return { success: false, error: "И-мэйл эсвэл нууц үг буруу байна" };
        }
      } catch (error) {
        throw error;
      }
    }
  }
