import classTutor ,{loadData} from "./searchResult/SR-tutorSec.js";

const tutors = await loadData();

function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        lessons: params.get("lesson") ? params.get("lesson").split(",") : null, 
    };
}

function renderTeachers(teachers) {
    const lessons = getURLParams();

    const filteredTeachers = teachers.filter(teacher => {
        const matchesLessons = lessons
            ? lessons.some(lesson => teacher.lesson.toLowerCase().includes(lesson.toLowerCase()))
            : true;
        return matchesLessons;
    });

    const container = document.getElementById("tutors");
    container.innerHTML = filteredTeachers
        .map(t => new classTutor(t).render())
        .reduce((p,c)=>p+c);
}

renderTeachers(tutors);

