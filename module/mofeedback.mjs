export default class Mofeedback{
    constructor(client){
        this.client=client;
    }


    async getcomment(){
        try{
            const query=`
            SELECT t.teacher_id,t.image ,s.last_name,s.first_name,f.comment
            FROM public."Feedback" f
            JOIN public."Teacher" t ON f.teacher_id = t.teacher_id
            JOIN public."Student" s ON f.student_id = s.student_id;
            `;
            const result=await this.client.query(query);
            return result.rows;
        }
        catch(error){
            throw error;
        }
    }
}