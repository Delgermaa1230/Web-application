import { tutors } from './loadData.js';
import { filterTutors } from './filterTutors.js';

let lovedTs = JSON.parse(localStorage.getItem('lovedTs')) || [];

export function initializeLovedButtons() {
    document.querySelectorAll("button.love").forEach((loveBtn) => {
        const Tid = loveBtn.dataset.id;
        const isLoved = lovedTs.some((t) => String(t.id) === Tid);
        loveBtn.classList.toggle("loved", isLoved);
    });
}

export function loveT(Tid) {
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
}

let debounceTimeout;

function debounceFilter(criteria, category) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => filterTutors(criteria, category), 300);  
}

export function attachLoveButtonListeners(tutors) {
    document.querySelectorAll('.Filterbtn').forEach(button => {
        button.addEventListener("click", () => {
            const criteria = button.dataset.criteria || button.innerText.trim();
            const category = button.dataset.category;

            debounceFilter(criteria, category); 
        });
    });

    document.querySelectorAll("button.love:not(.listener-added)").forEach((button) => {
        button.classList.add("listener-added");
        button.addEventListener("click", (event) => {
            event.preventDefault();
            const Tid = event.target.closest("button.love").dataset.id;
            loveT(Tid, tutors);
        });
    });
}

