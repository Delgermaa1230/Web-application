import tutorSec, { loadData } from "./SR-tutorSec.js";

const tutorData = await loadData();

function renderTutors(filteredData) {
    document.getElementById("tutors").innerHTML = ""; 

    if (filteredData.length == 0) {
        const noResultsMessage = `<p style = "color: var(--base-text-color); font-size: var(--base-h6-font-size); padding: var(--base-padding)">Хайлт олдсонгүй</p>`;
        document.getElementById("tutors").insertAdjacentHTML("beforeend", noResultsMessage);
        return;
    }

    const Tutorhtml = filteredData
        .map(td => (new tutorSec(td)).render())
        .reduce((p, c) => p + c, ""); 

    document.getElementById("tutors").insertAdjacentHTML("beforeend", Tutorhtml);
}

renderTutors(tutorData);

function filterTutors(criteria, category) {
    let filteredData;

    if (category === "all") {
        filteredData = tutorData; 
    } else if (category === "online" || category === "online") {
        filteredData = tutorData.filter(tutor => tutor.mode === category);
    } else if (category === "classroom" || category === "classroom") {
        filteredData = tutorData.filter(tutor => tutor.mode === category);
    } else if (category === "rating") {
        filteredData = tutorData.filter(tutor => tutor.ratings === parseInt(criteria));
    } else if (category === "ranking") {
        filteredData = tutorData.filter(tutor => tutor.ranking === criteria);
    } else if (category === "price") {
        const sortedData = tutorData.slice(); 
        filteredData = criteria === "Ихээс бага"
            ? sortedData.sort((a, b) => b.price - a.price)
            : sortedData.sort((a, b) => a.price - b.price);
    } else {
        filteredData = []; 
    }

    renderTutors(filteredData);
}


document.querySelectorAll('.Filterbtn').forEach(button => {
    button.addEventListener("click", () => {
        const criteria = button.dataset.criteria || button.innerText.trim();
        const category = button.dataset.category;

        console.log({ criteria, category }); 
        filterTutors(criteria, category);
    });
});

