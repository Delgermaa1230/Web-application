import { fetchTutorsData } from '../modules/fetchTutorsData.js';
import { renderTutors } from '../modules/renderTutors.js';
import { transformTeacherData } from '../modules/transformTutors.js';

async function loadSearchResults() {
    const query = new URLSearchParams(window.location.search).get("q"); // Хайлтын query авах
    const data = await fetchTutorsData();
    const transformedData = Array.isArray(data) ? data.map(transformTeacherData) : (data.teachers || []).map(transformTeacherData);

    const filteredTutors = transformedData.filter(teacher => 
        teacher.firstName.toLowerCase().includes(query.toLowerCase()) || 
        teacher.lastName.toLowerCase().includes(query.toLowerCase())
    );

    const container = document.getElementById("tutors");
    renderTutors(container, filteredTutors);
}

document.addEventListener("DOMContentLoaded", loadSearchResults);
