import { fetchTutorsData } from '../modules/fetchTutorsData.js';
import { renderTutors } from '../modules/renderTutors.js';
import { transformTeacherData } from '../modules/transformTutors.js';

async function loadSearchResults() {
    const query = new URLSearchParams(window.location.search).get("lesson")?.toLowerCase().trim();//toLowerCase().trim() хэрэглэгч том/жижиг үсэг хольж бичсэн ч ялгаагүй болгоно.
    
    if (!query) {
        console.error("hooson bn");
        return;
    }

    try {
        const data = await fetchTutorsData();
        const transformedData = Array.isArray(data) 
            ? data.map(transformTeacherData) 
            : (data.teachers || []).map(transformTeacherData);

        const filteredTutors = transformedData.filter(teacher => {
           
            const nameMatch = 
                teacher.firstName.toLowerCase().includes(query) || 
                teacher.lastName.toLowerCase().includes(query);
            
            const lessonMatch = teacher.lessons.some(lesson => 
                lesson.lesson_name.toLowerCase().includes(query)
            );

            return nameMatch || lessonMatch;
        });

        const container = document.getElementById("tutors");
        renderTutors(container, filteredTutors);

    } catch (error) {
        console.error("Search failed:", error);
        const container = document.getElementById("tutors");
        container.innerHTML = `<p>Хайлт явагдаагүй байна: ${error.message}</p>`;
    }
}

document.addEventListener("DOMContentLoaded", loadSearchResults);

import { renderTutors } from './renderTutors.js';
import { tutors } from './loadData.js';

export function filterTutors(criteria, category) {
    if (!tutors) {
        console.log("Data load hiigdsengu");
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
        fData = tutors.filter(tutor => tutor.rank === criteria);
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

