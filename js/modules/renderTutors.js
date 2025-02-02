export function renderTutors(container, filteredTutors) {
    container.innerHTML = "";

    if (filteredTutors.length === 0) {
        const nRM = `<p style="color: var(--base-text-color); font-size: var(--base-h6-font-size); padding: var(--base-padding)">Хайлт олдсонгүй</p>`;
        container.insertAdjacentHTML("beforeend", nRM);
        return;
    }

    filteredTutors.forEach((b) => {
        const tE = document.createElement('tutor-card');
        tE.setAttribute('data-bagsh', JSON.stringify(b));
        container.appendChild(tE);
    });
}

