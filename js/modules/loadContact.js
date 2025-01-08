function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const tutorId = getQueryParam('id');

function transformTeacherData(teacher) {
    return {
        id: teacher.teacher_id,
        firstName: teacher.first_name,
        firstLetterOfLastName: teacher.last_name?.[0] || '', 
        image: teacher.image || '',
        ratings: teacher.retings || 0, 
        numberOfRatings: teacher.number_of_ratings || 0,
        description: teacher.description || '',
        lessons: teacher.lessons || [],
        email: teacher.email || '',
        ranking: teacher.rank || 'N/A',
        price: teacher.price || 2500,
        possibleHours: teacher.possible_hours || [],
    };
}

async function loadData() {
    try {
        const result = await fetch("http://localhost:3000/api/teachers");
        const data = await result.json();

        console.log("Raw API response:", data);

        // Handle different data structures
        const teachers = Array.isArray(data) ? data : data.teachers;

        if (!teachers || !Array.isArray(teachers)) {
            console.error("Invalid data structure:", teachers);
            return;
        }

        const container = document.querySelector('.container');
        if (!container) {
            console.error("Container element not found");
            return;
        }

        const tutorId = getQueryParam('id');
        console.log("Query parameter tutorId:", tutorId);

        const selectedTutor = teachers.find(
            teacher => String(teacher.teacher_id) === String(tutorId)
        );

        if (selectedTutor) {
            const transformedTutor = transformTeacherData(selectedTutor);
            const tutorElement = document.createElement('contact-tutor');
            tutorElement.setAttribute('data-bagsh', JSON.stringify(transformedTutor));
            tutorElement.classList.add("main");
            container.appendChild(tutorElement);
        } else {
            console.warn("Tutor with the specified ID not found");
            console.log("Available IDs:", teachers.map(t => t.teacher_id));
        }
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

loadData();

