let tutors = null;

async function loadData() {
    const result = await fetch("../data/teacher.json");
    const tutorData = await result.json();
    tutors = tutorData.teachers;
    console.log("Data loaded:", tutors);
    renderTutors(tutors);
}

function renderTutors(fData) {
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

function filterTutors(criteria, category) {
    if (!tutors) {
        console.log("Data not loaded yet");
        return;
    }

    let fData;

    if (category === "all") {
        fData = tutors;
    } else if (category === "online" || category === "classroom") {
        fData = tutors.filter(tutor => tutor.mode === category);
    } else if (category === "rating") {
        fData = tutors.filter(tutor => tutor.ratings === parseInt(criteria));
    } else if (category === "ranking") {
        fData = tutors.filter(tutor => tutor.ranking === criteria);
    } else if (category === "price") {
        const sortedData = tutors.slice();
        fData = criteria === "Ихээс бага"
            ? sortedData.sort((a, b) => b.price - a.price)
            : sortedData.sort((a, b) => a.price - b.price);
    } else {
        fData = [];
    }

    renderTutors(fData);
    console.log(fData);
}

let lovedTs = JSON.parse(localStorage.getItem('lovedTs')) || [];

window.initializeLovedButtons = () => {
    document.querySelectorAll("button.love").forEach((loveBtn) => {
        const Tid = loveBtn.dataset.id;
        const isLoved = lovedTs.some((t) => String(t.id) === Tid);
        loveBtn.classList.toggle("loved", isLoved);
    });
};

window.loveT = (Tid) => {
    const t = tutors.find((i) => String(i.id) === String(Tid)); 
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
    document.querySelectorAll('.Filterbtn').forEach(button => {
        button.addEventListener("click", () => {
            const criteria = button.dataset.criteria || button.innerText.trim();
            const category = button.dataset.category;
    
            console.log({ criteria, category });
            filterTutors(criteria, category);
        });
    });
    document.querySelectorAll("button.love:not(.listener-added)").forEach((button) => {
        button.classList.add("listener-added");
        button.addEventListener("click", (event) => {
            event.preventDefault();
            const Tid = event.target.closest("button.love").dataset.id;
            loveT(Tid);
        });
    });

}

loadData
