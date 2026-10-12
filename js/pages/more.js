import { transformTeacherMoreData } from "../modules/transformTutors.js";

// Url Parameter авах функц
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// URL аас багшийн id г авах
const tutorId = getQueryParam('id');

async function loadMoreData() {
        // багшийн мэдээллийг оруулах container
        const container = document.querySelector('.container');
        if (!/^\d+$/.test(tutorId || '')) {
            container.textContent = 'Багш олдсонгүй.';
            return;
        }
        const response = await fetch(`/api/teachers/${tutorId}`);
        if (!response.ok) {
            container.textContent = response.status === 404 ? 'Багш олдсонгүй.' : 'Багшийн мэдээлэл ачаалж чадсангүй.';
            return;
        }
        const { teacher } = await response.json();
        const selectedTutor = transformTeacherMoreData(teacher);

        // Сонгогдсон багшийн датаг хувирган, display хийх
        if (selectedTutor) {
            // Хувиргасан датагаа tutor-more-page component д оруулан display хийнэ
            const tutorElement = document.createElement('tutor-morepage');
            tutorElement.setAttribute('data-bagsh', JSON.stringify(selectedTutor));
            tutorElement.setAttribute('class', "main");
            container.appendChild(tutorElement);
        } else {
            container.innerHTML = '<p>Багш олдсонгүй</p>';
        }
}

document.addEventListener("DOMContentLoaded", () => {
    loadMoreData().catch(() => {
        document.querySelector('.container').textContent = 'Багшийн мэдээлэл ачаалж чадсангүй.';
    });
});
