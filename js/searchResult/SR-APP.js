import tutorSec, { loadData } from "./SR-tutorSec.js";

const tutorData = await loadData();

function renderTutors(fData) {
    document.getElementById("tutors").innerHTML = ""; 

    if (fData.length == 0) {
        const nRM = `<p style = "color: var(--base-text-color); font-size: var(--base-h6-font-size); padding: var(--base-padding)">Хайлт олдсонгүй</p>`;
        document.getElementById("tutors").insertAdjacentHTML("beforeend", nRM);
        return;
    }

    const container = document.querySelector('#tutors');

    fData.forEach((bagsh) => {
        const tutorElement = document.createElement('tutor-card');
        tutorElement.setAttribute('data-bagsh', JSON.stringify(bagsh));
        container.appendChild(tutorElement);
    });

}

renderTutors(tutorData);

function filterTutors(criteria, category) {
    let fData;

    if (category === "all") {
        fData = tutorData; 
    } else if (category === "online" || category === "classroom") {
        fData = tutorData.filter(tutor => tutor.mode === category);
    } else if (category === "rating") {
        fData = tutorData.filter(tutor => tutor.ratings === parseInt(criteria));
    } else if (category === "ranking") {
        fData = tutorData.filter(tutor => tutor.ranking === criteria);
    } else if (category === "price") {
        const sortedData = tutorData.slice(); 
        fData = criteria === "Ихээс бага"
            ? sortedData.sort((a, b) => b.price - a.price)
            : sortedData.sort((a, b) => a.price - b.price);
    } else {
        fData = []; 
    }

    renderTutors(fData);
}


document.querySelectorAll('.Filterbtn').forEach(button => {
    button.addEventListener("click", () => {
        const criteria = button.dataset.criteria || button.innerText.trim();
        const category = button.dataset.category;

        console.log({ criteria, category }); 
        filterTutors(criteria, category);
    });
});

