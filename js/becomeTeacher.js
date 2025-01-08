import { loadDataLocal } from "./modules/loadData.js";

async function initializeDropdown() {
    const data = await loadDataLocal();
    console.log(data);

    const optionsArray = data[0].lessons;

    populateDropdown(optionsArray);

    document.getElementById('search-input').addEventListener('keyup', filterOptions);
    document.getElementById('search-input').addEventListener('click', showDropdown);
    document.getElementById('add-button').addEventListener('click', addSelectedOption);
}

function populateDropdown(optionsArray) {
    const dropdown = document.getElementById("dropdown-options");
    dropdown.innerHTML = ""; 
    optionsArray.forEach(option => {
        const div = document.createElement("div");
        div.className = "option";
        div.textContent = option;
        div.onclick = () => selectOption(option);
        dropdown.appendChild(div);
    });
}

function showDropdown() {
    document.getElementById("dropdown-options").style.display = "block";
}

function filterOptions() {
    const input = document.getElementById("search-input");
    const filter = input.value.toLowerCase();
    const options = document.getElementsByClassName("option");

    for (let i = 0; i < options.length; i++) {
        const text = options[i].textContent || options[i].innerText;
        options[i].style.display = text.toLowerCase().includes(filter) ? "" : "none";
    }
}

function selectOption(value) {
    const input = document.getElementById("search-input");
    input.value = value;
    document.getElementById("dropdown-options").style.display = "none"; // Hide dropdown after selection
}

function addSelectedOption() {
    const input = document.getElementById("search-input");
    const selectedOption = input.value.trim();

    if (selectedOption) {
        const leftSection = document.querySelector('.selectedSubList');
        const div = document.createElement("div");
        div.className = "UploadingGrade";

        const lessonP = document.createElement("p");
        lessonP.className = "lessonInput";
        lessonP.textContent = selectedOption;

        const attachButton = document.createElement("button");
        attachButton.className = "important-button";
        attachButton.textContent = "хавсаргах";

        const removeButton = document.createElement("button");
        removeButton.className = "important-button";
        removeButton.textContent = "x";
        removeButton.onclick = () => div.remove();

        div.appendChild(attachButton);
        div.appendChild(lessonP);
        div.appendChild(removeButton);

        leftSection.appendChild(div);

        input.value = "";
        document.getElementById("dropdown-options").style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", initializeDropdown);
