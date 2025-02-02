import { transformTeacherContactData } from "../modules/transformTutors.js";
import { fetchTutorsData } from "../modules/fetchTutorsData.js";

// Url Parameter авах функц
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// URL аас багшийн id г авах
const tutorId = getQueryParam('id');

async function loadMoreData() {
        const data = await fetchTutorsData();
        const tutors = Array.isArray(data) ? data.map(transformTeacherContactData) : (data.teachers || []).map(transformTeacherContactData);

        // багшийн мэдээллийг оруулах container
        const container = document.querySelector('.container');

        // URL parameter аар дамжиж ирсэн id тай багшийн мэдээллийг авах
        const selectedTutor = tutors.find((t) => String(t.id) === String(tutorId));
        console.log("Сонгогдсон багшийн дата:", selectedTutor);

        // Сонгогдсон багшийн датаг хувирган, display хийх
        if (selectedTutor) {
            // Хувиргасан датагаа contact-tutor component д оруулан display хийнэ
            const tutorElement = document.createElement('contact-tutor');
            tutorElement.setAttribute('data-bagsh', JSON.stringify(selectedTutor));
            tutorElement.setAttribute('class', "main");
            container.appendChild(tutorElement);
        } else {
            container.innerHTML = '<p>Багш олдсонгүй</p>';
        }
}

document.addEventListener("DOMContentLoaded", loadMoreData);
