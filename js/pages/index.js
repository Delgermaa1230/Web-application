import { fetchTutorsData } from '../modules/fetchTutorsData.js';
import { renderTutors } from '../modules/renderTutors.js';
import { transformTeacherData } from '../modules/transformTutors.js';

async function loadTopTutors() {
    const container = document.getElementById("tutors");
    try {
        const data = await fetchTutorsData();
        const transformedData = Array.isArray(data) ? data.map(transformTeacherData) : (data.teachers || []).map(transformTeacherData);
        renderTutors(container, transformedData.slice(0, 8));
    } catch (error) {
        container.textContent = 'Багшийн мэдээлэл ачаалж чадсангүй. Дахин оролдоно уу.';
    }
}

document.addEventListener("DOMContentLoaded", loadTopTutors);
