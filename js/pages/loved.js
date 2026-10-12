import { fetchTutorsData } from '../modules/fetchTutorsData.js';
import { renderTutors } from '../modules/renderTutors.js';
import { transformTeacherData } from '../modules/transformTutors.js';

async function loadLovedTutors() {
    // Багш нарын мэдээллийг серверээс авах
    const data = await fetchTutorsData();
    const transformedData = Array.isArray(data) ? data.map(transformTeacherData) : (data.teachers || []).map(transformTeacherData);

    // LocalStorage-аас хэрэглэгчийн like дарсан багш нарын id-уудыг авах
    const lovedTutorIds = lovedTutorsManager.lovedTutors; // localStorage-оос авах шаардлагагүй

    // transformedData-аас lovedTutors-ийн id-тай багш нарыг шүүж авах
    const lovedTutors = transformedData.filter(teacher => lovedTutorIds.includes(String(teacher.id)));

    // Тухайн багш нарыг render хийх
    const container = document.getElementById("tutors");
    container.innerHTML = ""; // 🆕 өмнөх элемэнтүүдийг цэвэрлэх
    if (!lovedTutors.length) {
        const empty = document.createElement('div');
        empty.className = 'app-card favorites-empty';
        empty.innerHTML = '<h3>Хадгалсан багш алга</h3><p>Таалагдсан багшийн зүрхэн тэмдгийг дарж энд хадгална.</p><a class="important-button" href="./SearchResult.html">Багш хайх</a>';
        container.append(empty);
    } else {
        renderTutors(container, lovedTutors);
    }
}

//LovedTutorsManager-д төлөвийн өөрчлөлтийг бүртгэх
lovedTutorsManager.subscribe(loadLovedTutors);

document.addEventListener("DOMContentLoaded", loadLovedTutors);

