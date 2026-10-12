import { transformTeacherContactData } from '../modules/transformTutors.js';

async function loadContactPage() {
    const container = document.querySelector('.container');
    const id = new URLSearchParams(location.search).get('id');
    if (!/^\d+$/.test(id || '')) {
        container.textContent = 'Багш олдсонгүй.';
        return;
    }
    try {
        const response = await fetch(`/api/teachers/${id}`);
        if (!response.ok) throw new Error(response.status === 404
            ? 'Багш олдсонгүй.' : 'Багшийн мэдээлэл ачаалж чадсангүй.');
        const { teacher } = await response.json();
        const element = document.createElement('contact-tutor');
        element.setAttribute('data-bagsh', JSON.stringify(transformTeacherContactData(teacher)));
        element.className = 'main';
        container.replaceChildren(element);
    } catch (error) {
        container.textContent = error.message;
    }
}

document.addEventListener('DOMContentLoaded', loadContactPage);
