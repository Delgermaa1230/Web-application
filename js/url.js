import classTutor, { loadData } from "./searchResult/SR-tutorSec.js";

async function initialize() {
    const tutors = await loadData();
    renderTeachers(tutors);
}

function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        lessons: params.get("lesson") ? params.get("lesson").split(",") : [],
    };
}

console.log(getURLParams());

function renderTeachers(teachers) {
    const { lessons } = getURLParams();

    // Ensure lessons is an array
    if (!Array.isArray(lessons)) {
        console.error("Invalid lessons format:", lessons);
        return;
    }

    // Filter teachers based on lessons
    const filteredTeachers = teachers.filter(teacher => {
        return lessons.length
            ? lessons.some(lesson => teacher.lesson?.toLowerCase().includes(lesson.toLowerCase()))
            : true;
    });

    // Check if the container exists
    const container = document.getElementById("tutors");
    if (!container) {
        console.error("No element with ID 'tutors' found.");
        return;
    }

    // Render the filtered teachers
    container.innerHTML = filteredTeachers
        .map(t => {
            try {
                return new classTutor(t).render();
            } catch (e) {
                console.error("Error rendering teacher:", t, e);
                return "";
            }
        })
        .join("");

    console.log("Rendered teachers:", container.innerHTML);
}


initialize();
