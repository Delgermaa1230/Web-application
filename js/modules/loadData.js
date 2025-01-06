import { renderTutors } from './renderTutors.js';

export let tutors = null;

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const lessonName = getQueryParam('lesson');

console.log("lesson 1name", lessonName);

export async function loadData() {
    if (tutors) {
        return;
    }
    const result = await fetch("../data/teacher.json");
    const tutorData = await result.json();
    tutors = tutorData.teachers;
    console.log("Data loaded:", tutors);

    const container = document.querySelector('#tutors');
    if (!container) {
        console.error("Container element not found");
        return;
    }

    if (lessonName) {

        const selectedTutors = tutors.filter((t) =>
            t.lessons.some((lesson) => String(lesson).toLowerCase().includes(String(lessonName).toLowerCase()))
        );

        console.log("songsu", selectedTutors);
        tutors = selectedTutors;
        renderTutors(selectedTutors);
    } else {
        renderTutors(tutors);
    }
}

export async function loadDataOfTop() {
    const result = await fetch("../data/teacher.json");
    const tutorData = await result.json();
    tutors = filterTopTutors(tutorData.teachers);
    console.log("Data loaded:", tutors);
    renderTutors(tutors);
}

const filterTopTutors = (t) => {
    return t
        .sort((a, b) => {
            const aScore = a.ratings * a.numberOfRatings;
            const bScore = b.ratings * b.numberOfRatings;
            return bScore - aScore;
        })
        .slice(0, 8);
};