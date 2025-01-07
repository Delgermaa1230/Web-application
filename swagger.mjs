// swagger.mjs

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
      title: 'Teacher Student API',
      version: '1.0.0',
      description: 'Багш, сурагчийн систем REST API documentation',
      contact: {
          name: 'API Support',
          email: 'your-email@example.com'
      }
  },
  servers: [
      {
          url: 'http://localhost:3000',
          description: 'Development server'
      }
  ],
  components: {
      schemas: {
          Teacher: {
              type: 'object',
              properties: {
                  teacher_id: {
                      type: 'integer',
                      description: 'Багшийн дугаар'
                  },
                  first_name: {
                      type: 'string',
                      description: 'Нэр'
                  },
                  last_name: {
                      type: 'string',
                      description: 'Овог'
                  },
                  email: {
                      type: 'string',
                      description: 'И-мэйл хаяг'
                  },
                  description: {
                      type: 'string',
                      description: 'Тайлбар'
                  },
                  retings: {
                      type: 'integer',
                      description: 'Үнэлгээ (0-5)'
                  },
                  rank: {
                      type: 'string',
                      description: 'Зэрэг'
                  }
              }
          },
          Student: {
              type: 'object',
              properties: {
                  student_id: {
                      type: 'integer',
                      description: 'Сурагчийн дугаар'
                  },
                  first_name: {
                      type: 'string',
                      description: 'Нэр'
                  },
                  last_name: {
                      type: 'string',
                      description: 'Овог'
                  },
                  email: {
                      type: 'string',
                      description: 'И-мэйл хаяг'
                  },
                  phone: {
                      type: 'string',
                      description: 'Утасны дугаар'
                  }
              }
          },
          Feedback: {
              type: 'object',
              properties: {
                  feedback_id: {
                      type: 'integer',
                      description: 'Санал хүсэлтийн дугаар'
                  },
                  teacher_id: {
                      type: 'integer',
                      description: 'Багшийн дугаар'
                  },
                  student_id: {
                      type: 'integer',
                      description: 'Сурагчийн дугаар'
                  },
                  comment: {
                      type: 'string',
                      description: 'Сэтгэгдэл'
                  }
              }
          },
          TeacherLesson: {
              type: 'object',
              properties: {
                  teacher_lesson_id: {
                      type: 'integer',
                      description: 'Хичээлийн дугаар'
                  },
                  teacher_id: {
                      type: 'integer',
                      description: 'Багшийн дугаар'
                  },
                  lesson_name: {
                      type: 'string',
                      description: 'Хичээлийн нэр'
                  },
                  price: {
                      type: 'number',
                      description: 'Үнэ'
                  }
              }
          },
          Error: {
              type: 'object',
              properties: {
                  message: {
                      type: 'string',
                      description: 'Алдааны мэдээлэл'
                  }
              }
          }
      }
  }
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: ['./routes/*.mjs']
};

export default swaggerOptions;