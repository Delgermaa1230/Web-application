import tutorSec ,{loadData} from "./SR-tutorSec.js";

const tutorData = await loadData();

function menufilter(tutorData,){
    return tutorData.filter()

}
const Tutorhtml = 
    tutorData
    .map(td =>(new tutorSec(td)).render())
    .reduce((p,c)=>p+c);


document.getElementById("tutors").insertAdjacentHTML("beforeend",Tutorhtml)