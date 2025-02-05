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