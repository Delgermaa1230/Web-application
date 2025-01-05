import { initializeLovedButtons, attachLoveButtonListeners } from './loveButtons.js';

export function renderTutors(fData) {
    document.getElementById("tutors").innerHTML = "";

    if (fData.length === 0) {
        const nRM = `<p style="color: var(--base-text-color); font-size: var(--base-h6-font-size); padding: var(--base-padding)">Хайлт олдсонгүй</p>`;
        document.getElementById("tutors").insertAdjacentHTML("beforeend", nRM);
        return;
    }

    const box = document.querySelector('#tutors');
    fData.forEach((b) => {
        const tE = document.createElement('tutor-card');
        tE.setAttribute('data-bagsh', JSON.stringify(b));
        box.appendChild(tE);
    });

    initializeLovedButtons();
    attachLoveButtonListeners();
}
