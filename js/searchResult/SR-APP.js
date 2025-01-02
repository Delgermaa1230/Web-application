import tutorSec, { loadData } from "./SR-tutorSec.js";

const tutorData = await loadData();

// Render tutors after filtering
function renderTutors(filteredData) {
    document.getElementById("tutors").innerHTML = ""; // Clear the content

    if (filteredData.length === 0) {
        const noResultsMessage = `<p>Хайлт олдсонгүй</p>`;
        document.getElementById("tutors").insertAdjacentHTML("beforeend", noResultsMessage);
        return;
    }

    const Tutorhtml = filteredData
        .map(td => (new tutorSec(td)).render())
        .reduce((p, c) => p + c, ""); // Concatenate all tutor HTML

    document.getElementById("tutors").insertAdjacentHTML("beforeend", Tutorhtml);
}

// Function to filter tutors based on criteria
function filterTutors(criteria, category) {
    let filteredData;

    if (category === "all") {
        filteredData = tutorData;
    } else if (category === "online" || category === "classroom") {
        filteredData = tutorData.filter(tutor => tutor.mode === category);
    } else if (category === "rating") {
        filteredData = tutorData.filter(tutor => tutor.ratings === parseInt(criteria));
    } else if (category === "ranking") {
        filteredData = tutorData.filter(tutor => tutor.rank === criteria);
    } else if (category === "price") {
        if (criteria === "Ихээс бага") {
            filteredData = tutorData.sort((a, b) => b.price - a.price);
        } else if (criteria === "Багаас их") {
            filteredData = tutorData.sort((a, b) => a.price - b.price);
        }
    }

    renderTutors(filteredData);
}

// Event listeners for filter buttons

document.querySelectorAll('.Filterbtn').forEach(button => {
    button.addEventListener("click", () => {
        const criteria = button.innerText.trim();
        const category = button.closest("ul").id;

        filterTutors(criteria, category);
    });
});
