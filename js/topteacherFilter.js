import classTutor, { loadData } from "./searchResult/SR-tutorSec.js";

const tutors = await loadData();

console.log(tutors[1].lessons);

const filterTopTeachers = (t) => {
  return t
    .sort((a, b) => {
      const aScore = a.ratings * a.numberOfRatings;
      const bScore = b.ratings * b.numberOfRatings;
      return bScore - aScore;
    })
    .slice(0, 8); 
};

const filteredtutors = filterTopTeachers(tutors);

const topTutorsHTML = 
    filteredtutors
    .map(array =>(new classTutor(array)).render())
    .reduce((p,c)=>p+c);

document.getElementById("topTutors").insertAdjacentHTML("beforeend", topTutorsHTML);

// Global scope-д функцийг зарлах
window.loveButtonClick = function(event, teacherName) {
    event.stopPropagation();
    event.preventDefault();

    // Local Storage-с өгөгдлийг унших
    let lovedTeachers = JSON.parse(localStorage.getItem("lovedTeachers")) || [];

    // Багш байгаа эсэхийг шалгах
    const isLoved = lovedTeachers.includes(teacherName);

    if (isLoved) {
        // Багшийг жагсаалтаас устгах
        lovedTeachers = lovedTeachers.filter(name => name !== teacherName);
        alert(`${teacherName} таны таалагдсан жагсаалтаас хасагдлаа!`);
    } else {
        // Багшийг жагсаалтад нэмэх
        lovedTeachers.push(teacherName);
        alert(`${teacherName} таны таалагдсан жагсаалтад нэмэгдлээ!`);
    }

    // Local Storage-д хадгалах
    localStorage.setItem("lovedTeachers", JSON.stringify(lovedTeachers));

    // Heart icon-ны төлөвийг өөрчлөх
    const heartIcon = event.currentTarget.querySelector('svg path');
    heartIcon.style.fill = isLoved ? 'none' : 'red';
}