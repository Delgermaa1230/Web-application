import tutorSec ,{loadData} from "./SR-tutorSec.js";

const tutorData = await loadData();

function renderTutors(filteredData){
    const Tutorhtml = 
    filteredData
    .map(td =>(new tutorSec(td)).render())
    .reduce((p,c)=>p+c);    

document.getElementById("tutors").insertAdjacentHTML("beforeend",Tutorhtml);
}

renderTutors(tutorData);

function filterTutors(criteria){
    let filteredData;

    if(criteria === "all"){
        filteredData = tutorData;
    }else {
        filteredData = tutorData.filter(tutor => tutor.unelgee === criteria)
    }

    renderTutors(filteredData);
}

document.getElementById("all").addEventListener("click", () => filterTutors("all"))
document.getElementById("1").addEventListener("click", () => filterTutors("1"))
document.getElementById("2").addEventListener("click", () => filterTutors("2"))
document.getElementById("3").addEventListener("click", () => filterTutors("3"))
document.getElementById("4").addEventListener("click", () => filterTutors("4"))
document.getElementById("5").addEventListener("click", () => filterTutors("5"))

