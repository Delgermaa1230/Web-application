export default class Molesson{
    constructor(client){
        this.client=client;
    }

    async getteachingsessions(){
        try{
            const query=`
            
SELECT
    s.first_name ,
    s.last_name,
    t.image ,
    ses.lesson_name ,
    ses.messege 
FROM
    public."Sessions" ses
JOIN
    public."Student" s ON ses.student_id = s.student_id
JOIN
    public."Teacher" t ON ses.teacher_id = t.teacher_id;

            `;
            const result=await this.client.query(query);
            return result.rows;
        }
        catch(error){
            throw error;
        }
    }
}