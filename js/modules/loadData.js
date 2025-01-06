import { renderTutors } from './renderTutors.js';

export let tutors = null;

export async function loadData() {
    if (tutors) {
        return;
    }
    const result = await fetch("../data/teacher.json");
    const tutorData = await result.json();
    tutors = tutorData.teachers;
    console.log("Data loaded:", tutors);
    renderTutors(tutors);
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