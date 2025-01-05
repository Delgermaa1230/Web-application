import { renderTutors } from './renderTutors.js';
import { tutors } from './loadData.js';

export function filterTutors(criteria, category) {
    if (!tutors) {
        console.log("Data not loaded yet");
        return;
    }

    let fData;

    if (category === "all") {
        fData = tutors;
    } else if (category === "online" || category === "classroom") {
        fData = tutors.filter(tutor => tutor.mode === category);
    } else if (category === "rating") {
        fData = tutors.filter(tutor => tutor.ratings === parseInt(criteria));
    } else if (category === "ranking") {
        fData = tutors.filter(tutor => tutor.ranking === criteria);
    } else if (category === "price") {
        const sortedData = tutors.slice();
        fData = criteria === "Ихээс бага"
            ? sortedData.sort((a, b) => b.price - a.price)
            : sortedData.sort((a, b) => a.price - b.price);
    } else {
        fData = [];
    }

    renderTutors(fData);
}

let debounceTimeout;
function debounceFilter(criteria, category) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => filterTutors(criteria, category), 300);  // Adjust 300ms delay as needed
}

