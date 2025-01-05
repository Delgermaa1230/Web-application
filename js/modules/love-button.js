let lovedTutors = JSON.parse(localStorage.getItem('lovedTutors')) || [];

export function initializeLovedButtons() {
    document.querySelectorAll("button.love").forEach((loveBtn) => {
        const tutorId = loveBtn.dataset.id;
        const isLoved = lovedTutors.some((tutor) => String(tutor.id) === tutorId);
        loveBtn.classList.toggle("loved", isLoved);
    });
}

export function loveTutor(tutors, tutorId) {
    const tutor = tutors.find((t) => String(t.id) === String(tutorId)); 
    if (!tutor) {
        alert("Т Tutor олдсонгүй.");
        return;
    }

    const loveBtn = document.querySelector(`button[data-id="${tutorId}"]`);
    const isLoved = lovedTutors.some((l) => l.id === tutor.id);

    if (!isLoved) {
        lovedTutors.push(tutor);
        localStorage.setItem("lovedTutors", JSON.stringify(lovedTutors));
        if (loveBtn) loveBtn.classList.add('loved');
    } else {
        const removeConfirm = confirm(`Та ${tutor.firstName}-г хасахыг хүсч байна уу?`);
        if (removeConfirm) {
            lovedTutors = lovedTutors.filter((l) => l.id !== tutor.id);
            localStorage.setItem("lovedTutors", JSON.stringify(lovedTutors));
            if (loveBtn) loveBtn.classList.remove('loved');
        }
    }
}

export function attachLoveButtonListeners(tutors) {
    document.querySelectorAll("button.love:not(.listener-added)").forEach((button) => {
        button.classList.add("listener-added");
        button.addEventListener("click", (event) => {
            event.preventDefault();
            const tutorId = event.target.closest("button.love").dataset.id;
            loveTutor(tutors, tutorId);
        });
    });
}
