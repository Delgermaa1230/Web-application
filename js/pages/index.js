import { fetchTutorsData } from '../modules/fetchTutorsData.js';
import { renderTutors } from '../modules/renderTutors.js';
import { transformTeacherData } from '../modules/transformTutors.js';

async function loadTopTutors() {
    const data = await fetchTutorsData();
    const transformedData = Array.isArray(data) ? data.map(transformTeacherData) : (data.teachers || []).map(transformTeacherData);

    const container = document.getElementById("tutors");
    renderTutors(container, transformedData.slice(0, 8)); // Зөвхөн топ 8 харуулах
}

document.addEventListener("DOMContentLoaded", loadTopTutors);
