let lovedTs = JSON.parse(localStorage.getItem('lovedTs')) || [];

export function renderLovedTs() {
    console.log(lovedTs);

    if (lovedTs.length === 0) {
        document.getElementById("lovedTutors").innerHTML = `<p style="color: var(--base-text-color); font-size: var(--base-h6-font-size); padding: var(--base-padding)">Таалагдсан багш алга!</p>`;
        return;
    }

    const box = document.querySelector('#lovedTutors');
    
    if (!box) {
        console.error('The element #lovedTutors does not exist in the DOM');
        return;
    }

    box.innerHTML = '';

    lovedTs.forEach((bagsh) => {
        const tutorElement = document.createElement('tutor-card');
        tutorElement.setAttribute('data-bagsh', JSON.stringify(bagsh));
        box.appendChild(tutorElement);
    });

    initializeLovedButtons();
    attachLoveButtonListeners();
}

window.initializeLovedButtons = () => {
    document.querySelectorAll("button.love").forEach((loveBtn) => {
        const Tid = loveBtn.dataset.id;
        const isLoved = lovedTs.some((t) => String(t.id) === Tid);

        loveBtn.classList.toggle("loved", isLoved);
    });
};

window.loveT = (Tid) => {
    const t = lovedTs.find((i) => String(i.id) === String(Tid));
    if (!t) {
        alert("Т Tutor олдсонгүй.");
        return;
    }

    const loveBtn = document.querySelector(`button[data-id="${Tid}"]`);
    const isLoved = lovedTs.some((l) => l.id === t.id);

    if (!isLoved) {
        lovedTs.push(t);
        localStorage.setItem("lovedTs", JSON.stringify(lovedTs));
        if (loveBtn) loveBtn.classList.add('loved');
    } else {
        const removeC = confirm(`Та ${t.firstName}-г хасахыг хүсч байна уу?`);
        if (removeC) {
            lovedTs = lovedTs.filter((l) => l.id !== t.id);
            localStorage.setItem("lovedTs", JSON.stringify(lovedTs));
            
            if (loveBtn) loveBtn.classList.remove('loved');

            const tutorCard = loveBtn.closest('tutor-card');
            if (tutorCard) tutorCard.remove();
        }
    }
};

function attachLoveButtonListeners() {
    document.querySelectorAll("button.love:not(.listener-added)").forEach((button) => {
        button.classList.add("listener-added");
        button.addEventListener("click", (event) => {
            event.preventDefault();
            const Tid = event.target.closest("button.love").dataset.id;
            loveT(Tid);
        });
    });
}
