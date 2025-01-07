// Utility functions
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function transformTeacherData(teacher) {
    return {
        id: teacher.teacher_id,
        firstName: teacher.first_name,
        lastName: teacher.last_name,
        image: teacher.image,
        ratings: teacher.retings ,  
        numberOfRatings: teacher.number_of_ratings ,
        description: teacher.description ,
        ranking: teacher.rank ,
        moreDescription: teacher.teacher_info ,
        teachingDescription: teacher.lesson_info ,
        price: teacher.price || 2500,
        lessons: teacher.lessons || [],
        comments: teacher.comments || [],
        possibleHours: teacher.possible_hours || [],
        email: teacher.email,
        phone: teacher.phone,
        mode: teacher.mode
    };
}

// Main execution
const tutorId = getQueryParam('id');
console.log("Loading data for tutor ID:", tutorId);

async function loadData() {
    try {
        const result = await fetch("http://localhost:3000/api/teachers");
        const data = await result.json();

        console.log("Raw API response:", data);

        const container = document.querySelector('.container');
        if (!container) {
            console.error("Container element not found");
            return;
        }

        // Handle both array and object with teachers property
        const teachers = Array.isArray(data) ? data : data.teachers;
        
        if (!Array.isArray(teachers)) {
            throw new Error('Invalid data structure received from API');
        }

        console.log("Teachers array:", teachers);

        const selectedTutor = teachers.find((t) => String(t.teacher_id) === String(tutorId));
        console.log("Selected tutor before transform:", selectedTutor);

        if (selectedTutor) {
            const transformedTutor = transformTeacherData(selectedTutor);
            console.log("Transformed tutor data:", transformedTutor);

            const tutorElement = document.createElement('tutor-morepage');
            tutorElement.setAttribute('data-bagsh', JSON.stringify(transformedTutor));
            tutorElement.setAttribute('class', "main");
            container.appendChild(tutorElement);
        } else {
            console.warn(`Tutor with ID ${tutorId} not found`);
            container.innerHTML = '<p>Багш олдсонгүй</p>';
        }
    } catch (error) {
        console.error("Error loading data:", error);
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = '<p>Өгөгдөл ачаалахад алдаа гарлаа</p>';
        }
    }
}

// Initialize
loadData();