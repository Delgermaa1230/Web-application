export function renderTutors(container, filteredTutors) {
    container.innerHTML = "";

    if (filteredTutors.length === 0) {
        const nRM = `<p class="app-muted" style="grid-column: 1 / -1; padding: 24px">Багш олдсонгүй. Өөр хичээл эсвэл шүүлтүүрээр хайна уу.</p>`;
        container.insertAdjacentHTML("beforeend", nRM);
        return;
    }

    filteredTutors.forEach((b) => {
        const tE = document.createElement('tutor-card');
        tE.setAttribute('data-bagsh', JSON.stringify(b));
        container.appendChild(tE);
    });
}

