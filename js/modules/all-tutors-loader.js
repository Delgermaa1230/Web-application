let data = null;
let lovedTs = JSON.parse(localStorage.getItem("lovedTs")) || [];

export async function loadData() {
    const result = await fetch("../data/teacher.json");
    data = await result.json();

    console.log("Data loaded:", data);

    const container = document.querySelector('#tutors');

    data.teachers.forEach((bagsh) => {
        const tutorElement = document.createElement('tutor-card');
        tutorElement.setAttribute('data-bagsh', JSON.stringify(bagsh));
        container.appendChild(tutorElement);
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
    const t = data.teachers.find((i) => String(i.id) === String(Tid));
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