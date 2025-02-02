import { fetchTutorsData } from '../modules/fetchTutorsData.js';
import { renderTutors } from '../modules/renderTutors.js';
import { transformTeacherData } from '../modules/transformTutors.js';

async function loadLovedTutors() {
    // Багш нарын мэдээллийг серверээс авах
    const data = await fetchTutorsData();
    const transformedData = Array.isArray(data) ? data.map(transformTeacherData) : (data.teachers || []).map(transformTeacherData);

    // LocalStorage-аас хэрэглэгчийн like дарсан багш нарын id-уудыг авах
    const lovedTutorIds = JSON.parse(localStorage.getItem('lovedTutors')) || [];
    console.log(lovedTutorIds); // lovedTutors дотор хадгалагдсан id-ууд

    // transformedData-аас lovedTutors-ийн id-тай багш нарыг шүүж авах
    const lovedTutors = transformedData.filter(teacher => lovedTutorIds.includes(String(teacher.id)));
    console.log(lovedTutors)

    // Тухайн багш нарыг render хийх
    const container = document.getElementById("tutors");
    renderTutors(container, lovedTutors);
}

document.addEventListener("DOMContentLoaded", loadLovedTutors);

