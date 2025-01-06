function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const tutorId = getQueryParam('id');

console.log("id is",tutorId);

async function loadData() {
    try {
        const result = await fetch("../data/teacher.json");
        const data = await result.json();

        console.log("Data loaded:", data);

        const container = document.querySelector('.container');
        if (!container) {
            console.error("Container element not found");
            return;
        }

        const ft = data.teachers;


        const selectedTutor = ft.find((i) => String(i.id) === String(tutorId));

        console.log(selectedTutor);

        if (selectedTutor) {
            const tutorElement = document.createElement('contact-tutor');
            tutorElement.setAttribute('data-bagsh', JSON.stringify(selectedTutor));
            tutorElement.setAttribute('class',"main");
            container.appendChild(tutorElement);
        } else {
            console.warn("Tutor with the specified ID not found");
        }
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

loadData();
