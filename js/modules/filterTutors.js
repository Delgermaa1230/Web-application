import { renderTutors } from './renderTutors.js';
import { fetchTutorsData } from './fetchTutorsData.js';
import { transformTeacherData } from './transformTutors.js';

let tutors = []; //багш нарын мэдээллийг хадгалах массив

async function initializeTutors() {
    try {
        const data = await fetchTutorsData();
        tutors = Array.isArray(data) 
            ? data.map(transformTeacherData) 
            : (data.teachers || []).map(transformTeacherData); // `data.teachers` дотор багшийн мэдээлэл байвал хөрвүүлэх
    } catch (error) {
        console.error("Tutors ugugdul tatagdsangui:", error);
    }
}

export function filterTutors(criteria, category) {
    const container = document.getElementById('tutors');
    
    if (tutors.length === 0) {
        console.log("Data load hiigdeeggui");
        return;
    }

    let filteredData = tutors;

    switch(category) {
        case "all":
            break;
        case "online":
        case "classroom":
            filteredData = tutors.filter(tutor => tutor.mode === category);
            break;
        case "rating":
            filteredData = tutors.filter(tutor => Math.round(tutor.ratings) === parseInt(criteria));
            break;
        case "ranking":
            filteredData = tutors.filter(tutor => tutor.rank === criteria);
            break;
        case "price":
            filteredData = [...tutors].sort((a, b) => 
                criteria === "Ихээс бага" 
                    ? b.price - a.price 
                    : a.price - b.price
            );
            break;
        default:
            filteredData = [];
    }

    renderTutors(container, filteredData); //renderTutors() функцийг дуудаж, сонгогдсон багш нарын мэдээллийг харуулна.
}

// Скрипт ачаалахад өгөгдөл татах
initializeTutors();

// Debounce function to prevent excessive filtering
let debounceTimeout;
export function debounceFilter(criteria, category) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => filterTutors(criteria, category), 300);
}

export { tutors };