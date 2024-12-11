import classTutor ,{loadData} from "./searchResult/SR-tutorSec.js";

const tutors = await loadData();

console.log(tutors);

const filterTopTeachers = (t) => {
  return t
    .sort((a, b) => {
      const aScore = a.ratings * a.numberOfRatings;
      const bScore = b.ratings * b.numberOfRatings;
      return bScore - aScore; //buurhaar erembleh
    })
    .slice(0, 6); 
};

const filteredtutors = filterTopTeachers(tutors);

const topTutorsHTML = 
    filteredtutors
    .map(array =>(new classTutor(array)).render())
    .reduce((p,c)=>p+c);

document.getElementById("topTutors").insertAdjacentHTML("beforeend",topTutorsHTML)

